# pi-hole-visualizer
Polls the pi-hole api to check how many ads have been blocked since last poll.
Uses number of ads blocked to illuminate LEDs.
Uses a running threshold of previous 10 ad block counts to set a median threshold to illuminate hi vs lo ad blocking LEDs.
If no ads are blocked, a no ad LED will be illuminated.

## crontab setup:
```
sudo crontab -e
```
```
0 * * * * /home/pi/pi-hole-visualizer/bin/autostart.sh
```

## autostart setup:
```
sudo vim /etc/xdg/lxsession/LXDE-pi/autostart
```
```
sudo /home/pi/pi-hole-visualizer/bin/autostart.sh
```