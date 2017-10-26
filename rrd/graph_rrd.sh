#!/bin/bash

RRDDIR="/root/terra/rrd"
OUTDIR="/root/terra/public/rrd"

VALUE=$1
 

cd $RRDDIR
for i in `ls -1 *.rrd | cut -f1 -d. `
do

#define the desired colors for the graphs

COLOR="#CCCC00"

#hourly
rrdtool graph --slope-mode $OUTDIR/${i}_hourly.png -w 800 -h 155 --start -12h \
DEF:$i=$RRDDIR/$i.rrd:$i:AVERAGE \
AREA:$i$COLOR \
LINE2:$i#CC0000:"$i" \
GPRINT:$i:MIN:"Min \: %4.2lf" \
GPRINT:$i:MAX:"Max \: %4.2lf" \
GPRINT:$i:LAST:"Current\: %4.2lf"

#daily
rrdtool graph $OUTDIR/${i}_daily.png -w 800 -h 155 --start -1d \
DEF:$i=$RRDDIR/$i.rrd:$i:AVERAGE \
AREA:$i$COLOR \
LINE2:$i#CC0000:"$i" \
GPRINT:$i:MIN:"Min \: %4.2lf" \
GPRINT:$i:MAX:"Max \: %4.2lf" 

#weekly
rrdtool graph $OUTDIR/${i}_weekly.png -w 800 -h 155 --start -1w \
DEF:$i=$RRDDIR/$i.rrd:$i:AVERAGE \
AREA:$i$COLOR \
LINE2:$i#CC0000:"$i" \
GPRINT:$i:MIN:"Min \: %4.2lf" \
GPRINT:$i:MAX:"Max \: %4.2lf" 

#monthly
rrdtool graph $OUTDIR/${i}_monthly.png -w 800 -h 155 --start -1m \
DEF:$i=$RRDDIR/$i.rrd:$i:AVERAGE \
AREA:$i$COLOR \
LINE2:$i#CC0000:"$i" \
GPRINT:$i:MIN:"Min \: %4.2lf" \
GPRINT:$i:MAX:"Max \: %4.2lf" 

#yearly
rrdtool graph $OUTDIR/${i}_yearly.png -w 800 -h 155 --start -1y \
DEF:$i=$RRDDIR/$i.rrd:$i:AVERAGE \
AREA:$i$COLOR \
LINE2:$i#CC0000:"$i" \
GPRINT:$i:MIN:"Min \: %4.2lf" \
GPRINT:$i:MAX:"Max \: %4.2lf" 

done

