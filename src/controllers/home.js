import https from 'https';
import 'dotenv/config';

const index = (req, res) => {
  res.render('index', {weather: null, error: null});
};

const post = (req, res) => {
  const apiKey = process.env.OPENWEATHER_APIKEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${req.body.city}&appid=${apiKey}`;
  https.get(url, (result) => {
    result.on('data',result => {
      result = JSON.parse(result.toString());
      if(result.main === undefined){
        return res.render('index', {
          weather: null,
          error: 'Error, please try again',
        });
      }else{
        return res.render('index', {
          weather: `It's ${result.main.temp} degrees in ${result.name}!`,
          error: null,
        });
      }
    });
  });
};

export default {
  index,
  post
};