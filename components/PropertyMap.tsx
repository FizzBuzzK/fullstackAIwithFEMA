'use client';

import { useState, useEffect, useRef } from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import { setDefaults, fromAddress, OutputFormat, type GeocodeOptions } from 'react-geocode';
import Spinner from './Spinner';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@googlemaps/js-api-loader";
import { Globe, Map as MapIcon } from "lucide-react";

import type { PropertyEntity } from '@/types/property';

type Props = { property: PropertyEntity };


/**
 * ======================================================
 * @param param0 
 * @returns 
 * ======================================================
 */
export default function PropertyMap({ property }: Props) {

  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [geocodeError, setGeocodeError] = useState(false);

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapError, setMapError] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);


  // 1) Geocode (with key): set coords
  useEffect(() => {

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY");
      setGeocodeError(true);
      setLoading(false);
      return;
    }

    // Configure react-geocode before calling fromAddress
    setDefaults({
      key: apiKey,
      language: 'en',
      region: 'US',
      outputFormat: OutputFormat.JSON,   
    } satisfies GeocodeOptions);


    const fetchCoords = async () => {
      try{
        const res = await fromAddress(
          `${property.location.street} ${property.location.city} ${property.location.state} ${property.location.zipcode}`
        );

        if (!res.results?.length) {
          setGeocodeError(true);
          setLoading(false);
          return;
        }

        const { lat, lng } = res.results[0].geometry.location;
        setLat(lat);
        setLng(lng);
      } 
      catch(err){
        console.error("Geocode error:", err);
        setGeocodeError(true);
      } 
      finally{
        setLoading(false);
      }
    };


    fetchCoords();

  }, [
    property.location.street,
    property.location.city,
    property.location.state,
    property.location.zipcode,
  ]);


  // 2) After loading is done and the container exists, init Google Map
  useEffect(() => {

    if (loading || geocodeError) return;          // wait for geocoding to finish
    if (!mapRef.current || map) return;           // need the container and avoid double init


    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      setMapError(true);
      return;
    }

    const initMap = async () => {

      try{
        const loader = new Loader({ apiKey, version: "weekly" });
        const { Map, MapTypeId } = (await loader.importLibrary("maps")) as google.maps.MapsLibrary;

        const center = (lat && lng) ? { lat, lng } : { lat: 25.775163, lng: -80.208615 };

        const mapInstance = new Map(mapRef.current!, {
          center,
          zoom: 14,
          mapTypeId: MapTypeId.ROADMAP,
        });

        // Optional: add a marker at the geocoded position
        if (lat && lng) {
          new google.maps.Marker({ position: { lat, lng }, map: mapInstance });
        }

        setMap(mapInstance);
      } 
      catch(err){
        console.error("Error loading Google Maps:", err);
        setMapError(true);
      }
    };


    initMap();

  }, [loading, geocodeError, lat, lng, map]);


  if (loading) return <Spinner loading={loading} />;


  if (geocodeError) {
    return <div className='text-xl'>No location data found</div>;
  }


  //======================================================
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-teal-700" />
          Interactive Map
        </CardTitle>
      </CardHeader>

      <CardContent>
        {mapError ? 
        (
          <div className="w-full h-80 rounded-lg border border-slate-200 bg-slate-50 flex flex-col items-center justify-center">
            <MapIcon className="h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Map Not Available</h3>
          </div>
        ) : 
        (
          <div ref={mapRef} className="w-full h-80 rounded-lg border border-slate-200" />
        )}
      </CardContent>
    </Card>

  );
  
}









