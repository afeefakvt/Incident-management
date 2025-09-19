import Script from "next/script"
import { useEffect, useState } from "react"

export default function LocationPicker() {
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    if (mapLoaded && window.google) {
      const map = new google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          center: { lat: 12.9716, lng: 77.5946 }, // default (Bangalore)
          zoom: 12,
        }
      )

      // Add marker on click
      let marker: google.maps.Marker | null = null
      map.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (marker) marker.setMap(null)
        marker = new google.maps.Marker({
          position: e.latLng!,
          map,
        })
        console.log("Picked location:", e.latLng?.toJSON())
      })
    }
  }, [mapLoaded])

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="afterInteractive"
        onLoad={() => setMapLoaded(true)}
      />
      <div id="map" className="w-full h-[400px] rounded-lg border" />
    </>
  )
}
