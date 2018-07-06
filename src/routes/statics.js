module.exports = app => {
    app.get('/statics', (req, res) => {
        const database = req.app.get('database');
        database.ReportModel.find({
        }, (err, user) => {
            if(err) throw err;

            let userArray = new Array();
            let dayArray = new Array();
            let monthArray = new Array();
            let timeArray = new Array();
            let sun = 0, mon = 0, tue = 0, wed = 0, thu = 0, fri = 0, sat = 0
            let jan = 0, feb = 0, mar = 0, apr = 0, may = 0, jun = 0, jul = 0, aug = 0, sep = 0, oct = 0, nov = 0, dec = 0;
            let AM1 = 0, AM2 = 0, AM3 = 0, AM4 = 0, AM5 = 0, AM6 = 0, AM7 = 0, AM8 = 0, AM9 = 0, AM10 = 0, AM11 = 0, AM12 = 0;
            let PM1 = 0, PM2 = 0, PM3 = 0, PM4 = 0, PM5 = 0, PM6 = 0, PM7 = 0, PM8 = 0, PM9 = 0, PM10 = 0, PM11 = 0, PM12 = 0;
            let solved = 0;

            for(let i in user){
                userArray.push({
                    danger: user[i].danger,
                    report_at: user[i].report_at
                });

                console.log(typeof user[i].report_at);
                console.log(user[i].report_at.toString().substring(16, 18));
                switch (user[i].report_at.toString().substring(0, 3)) {
                    case 'Sun':
                        sun++;
                        break;
                    
                    case 'Mon':
                        mon++;
                        break;

                    case 'Tue': 
                        tue++;
                        break;

                    case 'Wed': 
                        wed++;
                        break;

                    case 'Thu':
                        thu++;
                        break;

                    case 'Fri':
                        fri++;
                        break;

                    case 'Sat':
                        sat++;
                        break;
                }

                switch (user[i].report_at.toString().substring(4, 7)) {
                    case 'Jan':
                        jan++;
                        break;
                    case 'Feb':
                        feb++;
                        break;
                    case 'Mar':
                        mar++;
                        break;
                    case 'Apr':
                        apr++;
                        break;
                    case 'May':
                        may++;
                        break;
                    case 'Jun':
                        jun++;
                        break;
                    case 'Jul':
                        jul++;
                        break;
                    case 'Aug':
                        aug++;
                        break;
                    case 'Sep':
                        sep++;
                        break;
                    case 'Oct':
                        oct++;
                        break;
                    case 'Nov':
                        nov++;
                        break;
                    case 'Dec':
                        dec++;
                        break;
                }

                switch (user[i].report_at.toString().substring(16, 18)) {
                    case '01':
                        AM1++;
                        break;
                    case '02':
                        AM2++;
                        break;
                    case '03':
                        AM3++;
                        break;
                    case '04':
                        AM4++;
                        break;
                    case '05':
                        AM5++;
                        break;
                    case '06':
                        AM6++;
                        break;
                    case '07':
                        AM7++;
                        break;
                    case '08':
                        AM1++;
                        break;
                    case '09':
                        AM9++;
                        break;
                    case '10':
                        AM10++;
                        break;
                    case '11':
                        AM11++;
                        break;
                    case '12':
                        AM12++;
                        break;
                    case '13':
                        PM1++;
                        break;
                    case '14':
                        PM2++;
                        break;
                    case '15':
                        PM3++;
                        break;
                    case '16':
                        PM4++;
                        break;
                    case '17':
                        PM5++;
                        break;
                    case '18':
                        PM6++;
                        break;
                    case '19':
                        PM7++;
                        break;
                    case '20':
                        PM8++;
                        break;
                    case '21':
                        PM9++;
                        break;
                    case '22':
                        PM10++;
                        break;
                    case '23':
                        PM11++;
                        break;
                    case '00':
                        PM12++;
                        break;
                }
                if(!user[i].danger)
                    solved += 1;
            }


            dayArray.push(sun, mon, tue, wed, thu, fri, sat);
            monthArray.push(jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec);
            
            timeArray.push(AM1, AM2, AM3, AM4, AM5, AM6, AM7, AM8, AM9, AM10, AM11, AM12, PM1, PM2, PM3, PM4, PM5, PM6, PM7, PM8, PM9, PM10, PM11, PM12);
            console.log("monthArray: "+monthArray);
            let percent=0;
            for(i in monthArray) {
                percent = percent + monthArray[i]
            }
            res.render('statics.ejs', {user: userArray, day: dayArray, mon: monthArray, time: timeArray, percent: percent, solved: solved});
        });
    });
}