const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "🚗 Mock OBD API está funcionando!",
    endpoint: "/obd",
    status: "online",
  });
});

// Utilitários para gerar dados simulados
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max, fixed = 2) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(fixed));
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Simulação de códigos de erro
const getDtcCodes = () => {
  const codes = [
    "P0301",
    "P0171",
    "P0420",
    "P0128",
    "P0455",
    "P0500",
    "C1234",
    "U0100",
  ];
  const count = randomInt(0, 3);
  return Array.from({ length: count }, () => getRandom(codes));
};

// Endpoint principal
app.get("/obd", (req, res) => {
  const data = {
    general: {
      speedKmh: randomInt(0, 200),
      rpm: randomInt(700, 7000),
      gear: getRandom(["P", "R", "N", "D", "1", "2", "3"]),
      odometerKm: 45231 + randomInt(0, 100),
      vin: "1HGCM82633A004352",
      dtcCodes: getDtcCodes(),
      location: {
        lat: -25.43 + Math.random() * 0.01,
        lng: -49.27 + Math.random() * 0.01,
      },
    },

    engine: {
      loadPercentage: randomInt(0, 100),
      coolantTempC: randomInt(70, 110),
      intakeAirTempC: randomInt(20, 50),
      oilTempC: randomInt(80, 120),
      oilPressurePsi: randomFloat(20, 80),
      manifoldPressureKpa: randomInt(20, 100),
      throttlePositionPercent: randomInt(0, 100),
      timingAdvanceDegrees: randomFloat(-10, 10),
      runtimeSeconds: randomInt(0, 3600),
    },

    fuelSystem: {
      fuelLevelPercent: randomInt(0, 100),
      fuelPressurePsi: randomInt(30, 60),
      fuelRateLph: randomFloat(0.5, 25),
      airFuelRatio: randomFloat(12, 15),
      shortTermFuelTrimPercent: randomFloat(-10, 10),
      longTermFuelTrimPercent: randomFloat(-10, 10),
    },

    battery: {
      voltage: randomFloat(12.0, 14.8),
      alternatorStatus: getRandom(["Charging", "Idle", "Off"]),
    },

    airIntake: {
      mafGPerSec: randomFloat(1, 25),
      mapKpa: randomInt(30, 90),
      iatC: randomInt(20, 45),
    },

    emissions: {
      evapSystemVaporPressure: randomFloat(-1.5, 1.5),
      catalystTempC: randomInt(100, 800),
      egrFlowPercent: randomFloat(0, 100),
      o2Sensors: {
        "bank1-sensor1": {
          voltage: randomFloat(0.1, 1.0),
          status: getRandom(["ready", "not ready"]),
        },
        "bank1-sensor2": {
          voltage: randomFloat(0.1, 1.0),
          status: getRandom(["ready", "not ready"]),
        },
      },
    },

    environment: {
      barometricPressureKpa: randomInt(90, 105),
      ambientAirTempC: randomInt(15, 40),
    },
  };

  res.json(data);
});

// Inicializa o servidor
const PORT = process.env.PORT || 3011;
app.listen(PORT, () => {
  console.log(`🚗 Mock OBD API rodando em http://localhost:${PORT}/obd`);
});
