#!/usr/bin/env bash
image_id=`docker build . | tail -n 1 | awk '{print $3}'`
docker run -it --rm $image_id bash
