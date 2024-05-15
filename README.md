<h1 align="center">
  WeatherWiseTravel
  </a>
</h1>

<p align="center">Easy-to-use tool for obtaining weather forecasts for up to 15 days to make it easier to plan appointments based on the weather

<p align="center">
  • <a href="#environment-variables">Environment variables</a><br>
  • <a href="#running-locally">Running locally</a><br>
  • <a href="#running-tests">Running tests</a><br>
  • <a href="#documentation">Documentation</a><br>
  • <a href="#used-tools">Used tools</a><br>
  • <a href="#license">License</a>
</p>

## Environment variables

To run this project, you will need the following environment variables:

`NODE_ENV=""`

`GEOCODE_API_KEY=""`

`VISUAL_CROSSING_API_KEY=""`

Remember to create your .env file properly:

```bash
cp -r .env.sample .env
```

```bash
cp -r .env.sample .dev.env
```

### Generating Geocoding API Key

To obtain a Geocoding API Key, follow the steps below:

- Head to **[Geocoding](https://geocode.maps.co/)** platform, register if it's your first time or just log in.

- Copy the generated API Key as the value of the `GEOCODE_API_KEY` environment key into the .env file.

### Generating VisualCrossing API Key

To obtain a VisualCrossing API Key, follow the steps below:

- Head to **[VisualCrossing](https://www.visualcrossing.com/)** platform, register if it's your first time or just log in.

- In the top navigation bar on the right, click on the `Account` button.

- Copy the value of `Key` as the value of the `VISUAL_CROSSING_API_KEY` environment key into the .env file.

## Running locally

Clone the project:

```bash
git clone https://github.com/matheustrres/weather-wise-travel.git
```

Enter the project directory:

```bash
cd weather-wise-travel
```

Install the necessary dependencies:

```bash
pnpm install
```

Build the project after installing the dependencies:

```bash
pnpm prestart
```

Start the server:

```bash
pnpm start
```

## Running tests

To run the tests, execute the following command:

```bash
pnpm test
```

## Documentation

-  Get the weather forecast for up to 15 days for an address

```http
  GET /api/v1/forecast/timeline?address=Wall Street
```

| Parameter   | Type       | Description                           |
| :---------- | :--------- | :---------------------------------- |
| `address` | `string` | **Required**. The target address |

## Used tools

- Node.js
- Typescript
- APIs: VisualCrossing, Geocoding Maps

## License

This project is licensed under the **[GPL 3.0](https://github.com/matheustrres/weather-wise-travel/blob/main/LICENSE)** license.