#!/bin/bash
echo $1
docker run -e FILE=$1 -p 3000:3000 lineserver