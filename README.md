# pi-hole-visualizer
Pi-hole visualizer

## Crontab setup:
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