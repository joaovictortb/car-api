const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "🚗 Mock OBD API está funcionando!",
    endpoints: {
      "/obd": "Dados completos (carro + OBD)",
      "/car": "Informações do carro apenas",
      "/obd-data": "Dados OBD apenas",
    },
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

// Dados do carro (informações do veículo)
const getCarInfo = () => {
  const cars = [
    {
      brand: "Honda",
      model: "Civic",
      year: 2022,
      color: "Branco",
      plate: "ABC-1234",
      fuelType: "Flex",
      transmission: "Automático",
      engine: "1.5L Turbo",
      doors: 4,
      seats: 5,
      category: "Sedan",
      vin: "1HGCM82633A004352",
    },
    {
      brand: "Toyota",
      model: "Corolla",
      year: 2023,
      color: "Prata",
      plate: "XYZ-5678",
      fuelType: "Flex",
      transmission: "CVT",
      engine: "2.0L Dynamic Force",
      doors: 4,
      seats: 5,
      category: "Sedan",
      vin: "1NXBU40E89Z123456",
    },
    {
      brand: "Volkswagen",
      model: "Golf GTI",
      year: 2021,
      color: "Vermelho",
      plate: "DEF-9012",
      fuelType: "Gasolina",
      transmission: "Manual",
      engine: "2.0L TSI",
      doors: 5,
      seats: 5,
      category: "Hatch",
      vin: "WVWZZZ1KZ8W123456",
    },
    {
      brand: "Ford",
      model: "Ranger",
      year: 2023,
      color: "Azul",
      plate: "GHI-3456",
      fuelType: "Diesel",
      transmission: "Automático",
      engine: "3.2L TDCi",
      doors: 4,
      seats: 5,
      category: "Picape",
      vin: "1FTEW1EG3JFA12345",
    },
    {
      brand: "Chevrolet",
      model: "Onix",
      year: 2022,
      color: "Preto",
      plate: "JKL-7890",
      fuelType: "Flex",
      transmission: "Automático",
      engine: "1.0L Turbo",
      doors: 4,
      seats: 5,
      category: "Hatch",
      vin: "9BWDE21J724123456",
    },
  ];

  return getRandom(cars);
};

// Endpoint principal
app.get("/obd", (req, res) => {
  const carInfo = getCarInfo();

  const data = {
    // Informações do carro
    car: {
      brand: carInfo.brand,
      model: carInfo.model,
      year: carInfo.year,
      color: carInfo.color,
      plate: carInfo.plate,
      fuelType: carInfo.fuelType,
      transmission: carInfo.transmission,
      engine: carInfo.engine,
      doors: carInfo.doors,
      seats: carInfo.seats,
      category: carInfo.category,
      vin: carInfo.vin,
    },

    // Dados OBD em tempo real
    general: {
      speedKmh: randomInt(0, 200),
      rpm: randomInt(700, 7000),
      gear: getRandom(["P", "R", "N", "D", "1", "2", "3"]),
      odometerKm: 45231 + randomInt(0, 100),
      vin: carInfo.vin,
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

// Endpoint para informações do carro
app.get("/car", (req, res) => {
  const carInfo = getCarInfo();
  res.json({
    car: carInfo,
    timestamp: new Date().toISOString(),
  });
});

// Endpoint para dados OBD apenas
app.get("/obd-data", (req, res) => {
  const carInfo = getCarInfo();

  const obdData = {
    general: {
      speedKmh: randomInt(0, 200),
      rpm: randomInt(700, 7000),
      gear: getRandom(["P", "R", "N", "D", "1", "2", "3"]),
      odometerKm: 45231 + randomInt(0, 100),
      vin: carInfo.vin,
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

  res.json(obdData);
});

// Inicializa o servidor
const PORT = process.env.PORT || 3011;
app.listen(PORT, () => {
  console.log(`🚗 Mock OBD API rodando em http://localhost:${PORT}`);
});
