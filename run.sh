#!/bin/bash
echo $1
docker run -e FILE=/data/$1 -v ~/data:/data -p 3000:3000 lineserver