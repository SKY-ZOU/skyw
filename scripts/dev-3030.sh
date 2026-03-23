#!/bin/zsh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$ROOT_DIR/.tmp"
LOG_FILE="$LOG_DIR/next-3030.log"
PID_FILE="$LOG_DIR/next-3030.pid"
NEXT_BIN="$ROOT_DIR/node_modules/.bin/next"
SCREEN_NAME="skyw3030"
PORT=3030
HEALTH_URL="http://127.0.0.1:${PORT}/zh-CN"

mkdir -p "$LOG_DIR"

find_running_pids() {
  screen -ls 2>/dev/null | awk -v name="$SCREEN_NAME" 'index($0, name) > 0 { print $1 }'
}

is_healthy() {
  curl -fsS -o /dev/null --max-time 5 "$HEALTH_URL"
}

status() {
  local pids
  pids="$(find_running_pids || true)"
  if [[ -n "$pids" ]]; then
    echo "running:${pids//$'\n'/,}"
    if is_healthy; then
      echo "healthy:$HEALTH_URL"
    else
      echo "unhealthy:$HEALTH_URL"
      return 1
    fi
  else
    echo "stopped"
    return 1
  fi
}

start() {
  local pids
  pids="$(find_running_pids || true)"
  if [[ -n "$pids" ]]; then
    echo "already-running:${pids//$'\n'/,}"
    status
    return 0
  fi

  (
    cd "$ROOT_DIR"
    : >"$LOG_FILE"
    screen -dmS "$SCREEN_NAME" zsh -lc "cd \"$ROOT_DIR\" && exec env TURBOPACK=0 \"$NEXT_BIN\" dev --port \"$PORT\" >>\"$LOG_FILE\" 2>&1"
    echo "$SCREEN_NAME" >"$PID_FILE"
  )

  for _ in {1..30}; do
    if is_healthy; then
      echo "started:$HEALTH_URL"
      return 0
    fi
    sleep 1
  done

  echo "start-timeout:$LOG_FILE"
  return 1
}

stop() {
  local pids
  pids="$(find_running_pids || true)"

  if [[ -z "$pids" && -f "$PID_FILE" ]]; then
    pids="$(tr '\n' ' ' < "$PID_FILE")"
  fi

  if [[ -z "${pids// }" ]]; then
    echo "already-stopped"
    rm -f "$PID_FILE"
    return 0
  fi

  while read -r pid; do
    [[ -z "$pid" ]] && continue
    screen -S "${pid##*.}" -X quit 2>/dev/null || true
  done <<< "$pids"

  rm -f "$PID_FILE"
  echo "stopped"
}

logs() {
  touch "$LOG_FILE"
  tail -n 80 "$LOG_FILE"
}

case "${1:-status}" in
  start)
    start
    ;;
  stop)
    stop
    ;;
  restart)
    stop
    start
    ;;
  status)
    status
    ;;
  logs)
    logs
    ;;
  *)
    echo "usage: scripts/dev-3030.sh {start|stop|restart|status|logs}"
    exit 1
    ;;
esac
