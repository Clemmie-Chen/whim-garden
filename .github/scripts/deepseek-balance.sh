#!/usr/bin/env bash
# usage: deepseek-balance.sh <balance> <last_step or ""> <daily: 1|0>
# prints the new ¥10 step on line 1, then an alert message on line 2 if one is due.
# Alerts: each time the balance drops to a lower ¥10 mark (¥40, ¥30, ¥20, ¥10), and every day while under ¥10.
bal=$1 prev=$2 daily=$3
# step = the ¥10 mark at or above the balance: 50.00 -> 50, 43.20 -> 50, 40.00 -> 40, 39.90 -> 40
step=$(awk -v b="$bal" 'BEGIN { s = int(b / 10) * 10; if (s < b) s += 10; print (s < 0 ? 0 : s) }')
echo "$step"
if [ -n "$prev" ] && [ "$step" -lt "$prev" ]; then
  echo "DeepSeek 余额 ¥$bal，已降到 ¥$step 以内"
elif [ "$daily" = 1 ] && awk -v b="$bal" 'BEGIN { exit !(b < 10) }'; then
  echo "DeepSeek 余额 ¥$bal，低于 ¥10，该充值了"
fi
