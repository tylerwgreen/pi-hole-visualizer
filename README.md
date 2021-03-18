# pi-hole-visualizer
Polls the pi-hole api to check how many ads have been blocked since last poll.
Uses number of ads blocked to illuminate LEDs.
Uses a running threshold of previous 10 ad block counts to set a median threshold to illuminate hi vs lo ad blocking LEDs.
If no ads are blocked, a no ad LED will be illuminated.

## PiHole Static IP setup:
PiHole needs a static IP to opperate properly.
Set the DHCP Reservation for the PiHole to PiHole IP

## PiHole DHCP setup:
Set both DHCP DNS servers to PiHole IP

## App API setup:
Set the IP of params.ApiUrl in /app/models/PiHoleAPI.js to the PiHoleIP

## crontab setup:
```
sudo crontab -e
```
This was abandoned in lieu of a reboot every night:
```
0 * * * * /home/pi/pi-hole-visualizer/bin/autostart.sh
```
Nightly reboot:
```
0 2 * * * /sbin/shutdown -r now

## autostart setup:
```
sudo vim /etc/xdg/lxsession/LXDE-pi/autostart
```
```
sudo /home/pi/pi-hole-visualizer/bin/autostart.sh
```
