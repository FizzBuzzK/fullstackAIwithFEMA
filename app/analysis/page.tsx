"use client";

import { useState, useEffect, useRef } from "react";

import { setDefaults, fromAddress, OutputFormat, type GeocodeOptions } from 'react-geocode';
import { Loader } from "@googlemaps/js-api-loader";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import {
  MapPin,
  AlertTriangle,
  CheckCircle,
  Info,
  Loader2,
  Globe,
  Cpu,
  Shield,
  TrendingUp,
  Map as MapIcon,
  Upload,
  Image as ImageIcon,
  Camera,
} from "lucide-react";


//==============================================================
interface FloodRiskData {
  riskLevel: "UNKNOWN" | "Low" | "Medium" | "High" | "Very High";
  description: string;
  elevation: any;
  hazardArea: any;
}


//==============================================================
export default function FloodDetectionSystem() {

  const [lat, setLat] = useState<number>(25.74361);
  const [lng, setLng] = useState<number>(-80.21028);

  const [inputStreet, setInputStreet] = useState("3251 S Miami Ave");
  const [inputCity, setInputCity] = useState("Miami");
  const [inputState, setInputState] = useState("FL");
  const [inputZip, setInputZip] = useState("33129");


  const [loading, setLoading] = useState(true);
  const [geocodeError, setGeocodeError] = useState(false);


  const [floodRisk, setFloodRisk] = useState<FloodRiskData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisType, setAnalysisType] = useState<"coordinates" | "image">("coordinates");

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [mapError, setMapError] = useState(false);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const mapRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const recs = [
    "Homeowners: Check the FEMA Flood Map Service Center (FMS) website (msc.fema.gov) by entering your address to determine your flood zone and risk level.",
    "Developers: Consult FEMA flood maps and local building codes *before* purchasing land; engage a geotechnical engineer to assess site-specific flood risk and required foundation design.",
    "Local Governments: Integrate FEMA flood zone data into zoning ordinances and land-use planning; develop and regularly update comprehensive flood mitigation strategies and emergency response plans."
  ];
             

  // Initialize Google Maps
  //=================================
  useEffect(() => {
    const initMap = async () => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;


    if(!apiKey || apiKey === "YOUR_API_KEY_HERE") {
      setMapError(true);
      return;
    }
	
	
    try{
      const loader = new Loader({
        apiKey,
        version: "weekly",
        // no need to list libraries here; we’ll import them explicitly below
      });

      // Load the Maps library (and Places if you use it elsewhere)
      const { Map, MapTypeId } = (await loader.importLibrary(
        "maps"
      )) as google.maps.MapsLibrary;

      await loader.importLibrary("places"); // optional if you actually use Places classes

      if(mapRef.current){
        const mapInstance = new Map(mapRef.current, {
          center: { lat: 25.775163, lng: -80.208615 },
          zoom: 10,
          mapTypeId: MapTypeId.TERRAIN,
        });

        setMap(mapInstance);
      }
    } 
    catch(error){
      console.error("Error loading Google Maps:", error);

      setMapError(true);
    }};

    initMap();

    }, []);


    // 1) Geocode (with key) → set coords
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
        try {
          const res = await fromAddress(
            `${inputStreet} ${inputCity} ${inputState} ${inputZip}`
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
        catch (err) {
          console.error("Geocode error:", err);
          setGeocodeError(true);
        } 
        finally {
          setLoading(false);
        }
      };
  
      fetchCoords();
      
    }, [inputStreet, inputCity, inputState, inputZip]);


  // API calls
  //=================================
  const callAPI = async (endpoint: string, data: any) => {

    const isCoordinates = endpoint.includes("coordinates");

    const response = await fetch(endpoint, {
      method: "POST",
      headers: isCoordinates ? { "Content-Type": "application/json" } : undefined,
      body: isCoordinates ? JSON.stringify(data) : data,
    });

    if(!response.ok) throw new Error(`API error: ${response.status}`);
    
    return response.json();
  };


  // Analysis handlers
  //=================================
  const handleCoordinateSubmit = async () => {
    
    setIsLoading(true);

    // Call Next.js API route
    try {
      const apiResponse = await callAPI("/api/analyze/coordinates", {
        latitude: lat,
        longitude: lng,
      });

      const riskData: FloodRiskData = {
        riskLevel: apiResponse.risk_level,
        description: apiResponse.description,
        elevation: apiResponse.elevation,
        hazardArea: apiResponse.sfhaTF,
      };


      setFloodRisk(riskData);
      setAiAnalysis(apiResponse.ai_analysis || "");


      // Update map
      if (map) {
        map.setCenter({ lat, lng });
        map.setZoom(15);

        map.data.forEach((feature) => map.data.remove(feature));

        const { Circle } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
        const markerLib = (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;

        // Decide Advanced vs legacy marker
        const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID; // set this in .env for Advanced Markers
        let placeMarker: google.maps.marker.AdvancedMarkerElement

        if (mapId) {
          // Advanced Markers path
          const { AdvancedMarkerElement } = markerLib;

          placeMarker = new AdvancedMarkerElement({
            position: { lat, lng },
            map,
            title: "Selected Location",
          });
        } 
   
        const riskColor = riskData.riskLevel === "Very High" ? 
          "#FF0000" : 
          riskData.riskLevel === "High" ? 
          "#FF6600" : 
          riskData.riskLevel === "Medium" ? 
          "#FFCC00" : 
          "#00FF00";

        new Circle({
          strokeColor: riskColor,
          strokeOpacity: 0.7,
          strokeWeight: 2,
          fillColor: riskColor,
          fillOpacity: 0.35,
          map,
          center: { lat, lng },
          radius: 1000,
        });
      }
    }
    catch(error){
      console.error("Error analyzing coordinates:", error);

      setAlertMessage(
        "Error analyzing coordinates. Please check if the backend server is running."
      );

      setShowAlert(true);
    }
    finally{
      setIsLoading(false);
    }
  };


  // Basic validation, keeps the file in state, builds a base64 preview for .
  //=================================
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if(file){
      // If the file size is over 10MB,
      // show alert message
      if(file.size > 10 * 1024 * 1024 || !file.type.startsWith("image/")){
        setAlertMessage(
          file.size > 10 * 1024 * 1024 ? 
          "Image size must be less than 10MB" : 
          "Please select a valid image file"
        );

        setShowAlert(true);

        return;
      }

      setSelectedImage(file);

      const reader = new FileReader();

      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };


  //=================================
  const handleImageAnalysis = async () => {
    if (!selectedImage) {
      setAlertMessage("Please select an image first");
      setShowAlert(true);

      return;
    }

    setIsLoading(true);

    try{
      const formData = new FormData();
      formData.append("file", selectedImage);

      // Call Next.js API route
      const apiResponse = await callAPI("/api/analyze/image", formData);

      const riskData: FloodRiskData = {
        riskLevel: apiResponse.risk_level,
        description: apiResponse.description,
        elevation: apiResponse.elevation,
        hazardArea: apiResponse.sfhaTF,

      };

      setFloodRisk(riskData);
      setAiAnalysis(apiResponse.ai_analysis || "");
    }
    catch(error){
      console.error("Error analyzing image:", error);

      setAlertMessage(
        "Error analyzing image. Please check if the backend server is running."
      );

      setShowAlert(true);
    }
    finally{
      setIsLoading(false);
    }
  };


  //=== Helper UI functions ===
  const getRiskVariant = (riskLevel: string) => riskLevel === "Very High" || riskLevel === "High" ? 
    "destructive" : 
    riskLevel === "Medium" ? 
    "default" : 
    riskLevel === "Low" ?
    "secondary":
    "outline";

  //=================================
  const getRiskIcon = (riskLevel: string) => riskLevel === "Very High" || riskLevel === "High" ? 
    (
      <AlertTriangle className="h-4 w-4" />
    ) : 
    riskLevel === "Medium" ? 
    (
      <Info className="h-4 w-4" />
    ) : 
    (
      <CheckCircle className="h-4 w-4" />
    );

  //==================================================== 
  // Render
  //====================================================
  return (
    
      <div className="w-full">

        {/*========================= 
           Header
           =========================*/}
        <div className="px-5 py-20 bg-stone-50 bg-gradient-to-b from-slate-100 to-sky-700 ">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center mb-10">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <Cpu className="h-8 w-8 text-blue-600" />
              </div>

              <h1 className="text-3xl font-bold text-slate-900">
                Flood Detection System with FEMA + Google Map + AI
              </h1>
            </div>

            <p className="text-slate-700 text-lg">
              Make smarter real estate choices with our Flood Detection System. 
            </p>

            <p className="text-slate-700 text-lg">
              Use location coordinates or neighborhood photos to detect potential flood hazards. 
            </p>

            <p className="text-slate-700 text-lg">
              Advanced AI terrain analysis gives you peace of mind before you invest.
            </p>
          </div>


        
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

            {/*========================= 
             Input Section
             =========================*/}
            <Card className="shadow-2xl border-0 bg-white backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Analysis Methods
                </CardTitle>
              </CardHeader>

              <CardContent>
                <Tabs value={analysisType} className="w-full"
                  onValueChange={(value) => setAnalysisType(value as "coordinates" | "image")}
                >
                  {/* Tab buttons */}
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="coordinates" className="flex items-center gap-2 hover:cursor-pointer">
                      <MapPin className="h-4 w-4" />
                      Coordinates
                    </TabsTrigger>

                    <TabsTrigger value="image" className="flex items-center gap-2 hover:cursor-pointer">
                      <ImageIcon className="h-4 w-4" />
                      Image Analysis
                    </TabsTrigger>
                  </TabsList>

                  {/* Coordinates input part */}
                  <TabsContent value="coordinates" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="latitude">Street</Label>

                        <Input id="latitude" type="text" value={inputStreet}
                          step="any"
                          placeholder="3251 S Miami Ave"
                          onChange={(e) => setInputStreet(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="longitude">City</Label>

                        <Input id="longitude" type="text" value={inputCity}
                          step="any"
                          placeholder="Miami"
                          onChange={(e) => setInputCity(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="longitude">State</Label>

                        <Input id="longitude" type="text" value={inputState}
                          step="any"
                          placeholder="FL"
                          onChange={(e) => setInputState(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="longitude">Zip Code</Label>

                        <Input id="longitude" type="text" value={inputZip}
                          step="any"
                          placeholder="33129"
                          onChange={(e) => setInputZip(e.target.value)}
                        />
                      </div>
                    </div>

                    <Button className="w-full hover:cursor-pointer" size="lg"
                      onClick={handleCoordinateSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? 
                      (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : 
                      (
                        <>
                          <MapPin className="mr-2 h-4 w-4" />
                          Analyze Coordinates
                        </>
                      )}
                    </Button>
                  </TabsContent>


                  {/* Image analysis input part */}
                  <TabsContent value="image" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
        
                        <input className="hidden" type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handleImageUpload}
                        />

                        {!imagePreview ? 
                        (
                          <div className="space-y-4">
                            <Upload className="h-12 w-12 mx-auto text-slate-400" />

                            <div>
                              <p className="text-sm font-medium text-slate-700">
                                Upload terrain image
                              </p>

                              <p className="text-xs text-slate-500 mt-1">
                                JPG, PNG, or GIF up to 10MB
                              </p>
                            </div>

                            
                            <Button className="hover:cursor-pointer" onClick={() => fileInputRef.current?.click()}
                              variant="outline"
                              size="sm"
                            >
                              <Camera className="mr-2 h-4 w-4" />
                              Choose Image
                            </Button>
                          </div>
                        ) : 
                        (
                          <div className="space-y-4">
                            <img className="max-h-48 mx-auto rounded-lg shadow-2xl"
                              src={imagePreview}
                              alt="Preview"
                            />

                            <div className="flex gap-2 justify-center">
                              <Button onClick={() => fileInputRef.current?.click()}
                                variant="outline"
                                size="sm"
                                className="hover:cursor-pointer"
                              >
                                <Camera className="mr-2 h-4 w-4" />
                                Change Image
                              </Button>

                              <Button
                                onClick={() => {
                                  setSelectedImage(null);
                                  setImagePreview("");
                                }}
                                variant="outline"
                                size="sm"
                                className="hover:cursor-pointer"
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Button to handle image analysis */}
                      <Button className="w-full hover:cursor-pointer" onClick={handleImageAnalysis}
                        disabled={isLoading || !selectedImage}
                        size="lg"
                      >
                        {isLoading ? 
                        (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : 
                        (
                          <>
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Analyze Image
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>


            {/*========================= 
              Results Section
             =========================*/}
            <Card className="shadow-2xl border-0 bg-white backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>

              <CardContent>
                {/* Show a loading state whenever the results are being processed */}
                {isLoading && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />

                    <p className="text-slate-600">
                      {analysisType === "coordinates" ? 
                      "Analyzing coordinates..." : 
                      "Analyzing image..."}
                    </p>
                  </div>
                )}


                {/* Result Section */}
                {floodRisk && !isLoading && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getRiskIcon(floodRisk.riskLevel)}
                        <span className="font-semibold">Risk Level</span>
                      </div>

                      <Badge className="text-sm" variant={getRiskVariant(floodRisk.riskLevel)}>
                        {floodRisk.riskLevel}
                      </Badge>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed">
                      {floodRisk.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {floodRisk.elevation}
                        </div>

                        <div className="text-xs text-slate-500">
                          Elevation (ft)
                        </div>
                      </div>

                      <div className="p-4 bg-white rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {floodRisk.hazardArea}
                        </div>

                        <div className="text-xs text-slate-500">
                          Insurance Required
                        </div>
                      </div>
                    </div>

                    {aiAnalysis && (
                      <>
                        <Separator />

                        <div>
                          <h4 className="font-medium text-slate-700 mb-3">
                            AI Analysis
                          </h4>

                          <div className="p-3 bg-slate-50 rounded-lg">
                            <p className="text-sm text-slate-600 whitespace-pre-wrap">
                              {aiAnalysis}
                            </p>
                          </div>
                        </div>
                      </>
                    )}


                    <div>
                      <h4 className="font-medium text-slate-700 mb-3">
                        Recommendations
                      </h4>
                      <ul className="space-y-2">
                        {recs.map((rec, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-slate-600"
                          >
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                      
                  </div>
                )}




                {!floodRisk && !isLoading && (
                  <div className="text-center py-12 text-slate-500">
                    <Shield className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                    <p>Choose an analysis method to see flood risk assessment</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>


        {/*========================= 
            Map Section
           =========================*/}
        <div className="px-5 py-20 bg-gradient-to-b from-sky-700 to-slate-100 ">

          <Card className="shadow-2xl border-0 bg-white backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-600" />
                Interactive Map
              </CardTitle>
            </CardHeader>

            <CardContent>
              {mapError ? 
              (
                <div className="w-full h-80 rounded-lg border border-slate-200 bg-slate-50 flex flex-col items-center justify-center">
                  <MapIcon className="h-16 w-16 text-slate-300 mb-4" />

                  <h3 className="text-lg font-semibold text-slate-700 mb-2">
                    Map Not Available
                  </h3>
                </div>
              ) : 
              (
                <div className="w-full h-120 rounded-lg border border-slate-200" ref={mapRef} />
              )}
            </CardContent>
          </Card>
        </div>
      
      </div>

  );

}



