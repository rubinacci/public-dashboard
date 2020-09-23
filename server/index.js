const express = require('express');
const path = require('path')

const app = express();

// React site route
app.use(express.static(path.join(__dirname, '../', 'build')));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'build', 'index.html'));
});

// Dummy service called by heroku process scheduler to prevent free dyno from sleeping
app.get("/api/keepalive", (req, res) => {
  res.sendStatus(200);
});

app.get("/api/stats", (req, res) => {
  res.json({
    topData: {
      statera: {
        shares: "0.03%",
        staxeth: "200",
        sta: "9832190831.233",
        apy: {
          "24hr": "88.99%",
          "1w": "18%",
          "1m": "18.3%",
          "1y": "18.3%"
        }
      },
      delta: {
        shares: "0.03%",
        staxeth: "200",
        sta: "9832190831.233",
        apy: {
          "24hr": "88.99%",
          "1w": "18%",
          "1m": "18.3%",
          "1y": "18.3%"
        }
      },
      phoenix: {
        shares: "0.03%",
        staxeth: "200",
        sta: "9832190831.233",
        apy:{
          "24hr": "88.99%",
          "1w": "18%",
          "1m": "18.3%",
          "1y": "18.3%"
        }
      },
      all: {
        shares: "0.03%",
        staxeth: "200",
        sta: "9832190831.233",
        apy:{
          "24hr": "88.99%",
          "1w": "18%",
          "1m": "18.3%",
          "1y": "18.3%"
        }
      }
    }
  });
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
