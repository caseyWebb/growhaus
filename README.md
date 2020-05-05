# growhaus

> Raspberry Pi Based Grow Room Automation

# Installation

```shell
$ yarn global add @caseywebb/growhaus
$ sudo growhaus
```

Optionally copy the [systemd unit file](./growhaus.service) to /etc/systemd/system/growhaus.service and run `sudo systemctl start growhaus && sudo systemctl enable growhaus` to enable on boot.

# API

A minimal webserver is exposed for retrieving and temporarily overriding the brightness.

### Get

```shell
$ curl localhost:8080
```

### Set

```shell
$ curl --data '{ "brightness": <1-255> }' -H "Content-Type: application/json" -X POST localhost:8080
```
