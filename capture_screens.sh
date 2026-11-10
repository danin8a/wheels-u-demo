#!/bin/bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT_DIR="/Users/danielnicolasochoabautista/.gemini/antigravity/brain/e7888c6d-ca7a-49fb-b333-9e73173069ac/screenshots"
USER_DIR="/tmp/chrome_snap"

mkdir -p "$OUT_DIR"

capture() {
  local name="$1"
  local url="$2"
  echo "Capturando $name desde $url..."
  "$CHROME" --headless \
    --user-data-dir="$USER_DIR" \
    --no-sandbox \
    --virtual-time-budget=6000 \
    --hide-scrollbars \
    --window-size=390,844 \
    --screenshot="$OUT_DIR/$name.png" \
    "$url" 2>/dev/null
}

capture "screen_1_welcome" "http://127.0.0.1:8089/"
capture "screen_2_login" "http://127.0.0.1:8089/(auth)/login"
capture "screen_3_search" "http://127.0.0.1:8089/(tabs)"
capture "screen_4_trip_detail" "http://127.0.0.1:8089/viaje/trip-1"
capture "screen_5_mis_viajes" "http://127.0.0.1:8089/(tabs)/mis-viajes"
capture "screen_6_live_route" "http://127.0.0.1:8089/viaje-en-curso/trip-1"
capture "screen_7_chat" "http://127.0.0.1:8089/chat/trip-1"
capture "screen_8_comunidad" "http://127.0.0.1:8089/(tabs)/comunidad"
capture "screen_9_perfil" "http://127.0.0.1:8089/(tabs)/perfil"
capture "screen_10_nuevo_viaje" "http://127.0.0.1:8089/viaje/nuevo"

echo "¡Capturas finalizadas exitosamente!"
