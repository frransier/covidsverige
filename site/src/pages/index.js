/** @jsx jsx */
import { jsx } from "theme-ui"
import { useEffect, useState } from "react"

import GoogleMapReact from "google-map-react"
import Layout from "../components/layout"

import SEO from "../components/seo"
import Tippy from "@tippyjs/react"
import "tippy.js/dist/tippy.css"
const sanityClient = require("@sanity/client")
const client = sanityClient({
  projectId: "a2c3b7gr",
  dataset: "first",
  useCdn: false,
})

const Marker = ({ country }) => {
  const size = country.cases

  return (
    <Tippy
      content={
        <div>
          <div>{country.name}</div>
          <div sx={{}}>
            <span>{country.cases} fall </span>
          </div>
          <div sx={{}}>
            <span>{country.newCases} nya </span>
          </div>
        </div>
      }
    >
      <div
        sx={{
          bg: "primary",
          opacity: 0.7,
          mx: -1,
          height: size > 1000 ? 65 : size > 500 ? 50 : size > 50 ? 30 : 15,
          width: size > 1000 ? 65 : size > 500 ? 50 : size > 50 ? 30 : 15,
          borderRadius: 88,
        }}
      ></div>
    </Tippy>
  )
}

const IndexPage = () => {
  const [countries, setCountries] = useState(null)
  const [total, setTotal] = useState(null)
  const [newCases, setNewCases] = useState(null)
  const [deaths, setDeaths] = useState(null)
  const [newDeaths, setNewDeaths] = useState(null)
  useEffect(() => {
    const query = `*[_type == 'country'] | order(cases desc)`
    client.fetch(query).then(x => setCountries(x))
  }, [])
  useEffect(() => {
    countries && console.log(countries)
    if (countries) {
      const total = countries.map(x => x.cases).reduce((a, b) => a + b, 0)
      const newCases = countries.map(x => x.newCases).reduce((a, b) => a + b, 0)
      const deaths = countries.map(x => x.deaths).reduce((a, b) => a + b, 0)
      const newDeaths = countries
        .map(x => x.newDeaths)
        .reduce((a, b) => a + b, 0)
      setTotal(total)
      setNewCases(newCases)
      setDeaths(deaths)
      setNewDeaths(newDeaths)
    }
  }, [countries])

  function createMapOptions(maps) {
    return {
      minZoom: 4,
      maxZoom: 7,
      styles: [
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [
            {
              color: "#e9e9e9",
            },
            {
              lightness: 17,
            },
          ],
        },
        {
          featureType: "landscape",
          elementType: "geometry",
          stylers: [
            {
              color: "#f5f5f5",
            },
            {
              lightness: 20,
            },
          ],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.fill",
          stylers: [
            {
              color: "#ffffff",
            },
            {
              lightness: 17,
            },
          ],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [
            {
              color: "#ffffff",
            },
            {
              lightness: 29,
            },
            {
              weight: 0.2,
            },
          ],
        },
        {
          featureType: "road.arterial",
          elementType: "geometry",
          stylers: [
            {
              color: "#ffffff",
            },
            {
              lightness: 18,
            },
          ],
        },
        {
          featureType: "road.local",
          elementType: "geometry",
          stylers: [
            {
              color: "#ffffff",
            },
            {
              lightness: 16,
            },
          ],
        },
        {
          featureType: "poi",
          elementType: "geometry",
          stylers: [
            {
              color: "#f5f5f5",
            },
            {
              lightness: 21,
            },
          ],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [
            {
              color: "#dedede",
            },
            {
              lightness: 21,
            },
          ],
        },
        {
          elementType: "labels.text.stroke",
          stylers: [
            {
              visibility: "on",
            },
            {
              color: "#ffffff",
            },
            {
              lightness: 16,
            },
          ],
        },
        {
          elementType: "labels.text.fill",
          stylers: [
            {
              saturation: 36,
            },
            {
              color: "#333333",
            },
            {
              lightness: 40,
            },
          ],
        },
        {
          elementType: "labels.icon",
          stylers: [
            {
              visibility: "off",
            },
          ],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [
            {
              color: "#f2f2f2",
            },
            {
              lightness: 19,
            },
          ],
        },
        {
          featureType: "administrative",
          elementType: "geometry.fill",
          stylers: [
            {
              color: "#fefefe",
            },
            {
              lightness: 20,
            },
          ],
        },
        {
          featureType: "administrative",
          elementType: "geometry.stroke",
          stylers: [
            {
              color: "#fefefe",
            },
            {
              lightness: 17,
            },
            {
              weight: 1.2,
            },
          ],
        },
      ],
    }
  }

  return (
    <Layout>
      <SEO title="Coronavirus antal fall i Sverige COVID-19" />
      <div style={{ width: "100%", height: "100vh", fontDisplay: "swap" }}>
        {countries && (
          <div
            sx={{
              display: "grid",
              gridTemplateColumns: "30% 30%",
              alignItems: "center",
              justifyItems: "center",
            }}
          >
            <h4>{total} fall</h4>

            <h4 sx={{ color: "primary" }}>{newCases} nya</h4>
            {/* <h4 sx={{ color: "" }}>{deaths} dödsfall</h4>
            <h4 sx={{ color: "primary" }}>{newDeaths || 0} nya</h4> */}
          </div>
        )}
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyBO8H3ggKEXrZwUW9Hz7apfoiceAgAjIjE" }}
          defaultCenter={{ lat: 61.278405, lng: 15.213439 }}
          defaultZoom={5}
          options={createMapOptions}
        >
          {countries &&
            countries.map((x, i) => (
              <Marker
                key={i}
                style={{ backgroundColor: "black" }}
                lat={x.lat}
                lng={x.lng}
                country={x}
              />
            ))}
        </GoogleMapReact>
        <div
          sx={{
            width: ["100%", "90%"],
            mt: 5,
            display: "flex",
            flexDirection: "column",
            mx: "auto",
            // alignItems: "center",
            // justifyContent: "center",

            // justifyItems: "center",

            // justifyItems: "center",
          }}
        >
          <div
            sx={{
              display: "grid",
              gridTemplateColumns: "auto 35%",
              borderBottom: "solid 1px",
              borderBottomColor: "alternative",
              textAlign: "right",
              fontWeight: "bold",
              p: 2,
            }}
          >
            <div sx={{ textAlign: "left" }}>Region</div>

            <div>Fall</div>
          </div>
          <div sx={{ pb: 4 }}>
            {countries &&
              countries.map((x, i) => (
                <div
                  key={i}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "auto  35%",
                    textAlign: "right",
                    bg: i % 2 ? "#f3f3f3" : null,
                    px: 2,
                    py: 1,

                    ":hover": {
                      bg: "lightgrey",
                    },
                  }}
                >
                  <div sx={{ textAlign: "left" }}>{x.name}</div>

                  <div>
                    {formatMoney(x.cases)} (+{formatMoney(x.newCases)})
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default IndexPage

function formatMoney(amount, decimalCount = 0, decimal = ",", thousands = " ") {
  try {
    decimalCount = Math.abs(decimalCount)
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount

    const negativeSign = amount < 0 ? "-" : ""

    let i = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
    ).toString()
    let j = i.length > 3 ? i.length % 3 : 0

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
        : "")
    )
  } catch (e) {
    console.log(e)
  }
}
