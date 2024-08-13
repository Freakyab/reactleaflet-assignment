"use client";
import dynamic from "next/dynamic";
import markers from "./components/location";
import React from "react";
import { FaMapMarkerAlt, FaArrowUp, FaArrowDown } from "react-icons/fa";

// Dynamically import the map component with SSR disabled
const MapWithNoSSR = dynamic(() => import("./components/map"), {
  ssr: false,
});

export default function Home() {
  const cardRefs: React.RefObject<HTMLDivElement>[] = markers.map(() =>
    React.createRef()
  );
  const [flyTo, setFlyTo] = React.useState({
    lat: 0,
    lng: 0,
  });
  const [activeIndex, setActiveIndex] = React.useState(0);

  const handleClick = (index: number) => {
    setActiveIndex(index);
    setFlyTo({
      lat: markers[index].position[0],
      lng: markers[index].position[1],
    });
    // cardRefs[index].current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="flex flex-col h-screen w-screen p-4 md:p-8 bg-[#EDF7F6]">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        Welcome to the <a href="https://react-leaflet.js.org/" className="text-blue-600 hover:underline">React Leaflet</a> demo!
      </h1>
      <div className="flex flex-col md:flex-row w-full h-full gap-4">
        <div className="flex-1 md:w-1/4 gap-2 overflow-y-auto bg-white py-1 px-2 h-fit rounded-md border-gray-500 border">
          {markers.map((marker, index) => (
            <div
              key={index}
              ref={cardRefs[index]}
              className={`flex items-center my-2 border border-gray-500 p-2 rounded-md cursor-pointer hover:bg-gray-200 transition-colors
                ${activeIndex === index ? "bg-gray-200 border-black border-2" : "bg-[#EDF7F6]"}
                
                `}
              onClick={() => handleClick(index)}
            >
              <FaMapMarkerAlt className="text-2xl text-blue-500 mr-2" />
              <div className="flex flex-col">
                <h2 className="text-lg font-bold">{marker.label}</h2>
                <p className="text-sm text-gray-600">
                  Latitude: {marker.position[0]}, Longitude: {marker.position[1]}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex-1 md:w-3/4 md:h-96">
          <MapWithNoSSR cardRefs={cardRefs} flyTo={flyTo} 
            className="h-full w-full rounded-md border border-gray-500 "
            setActiveIndex={setActiveIndex}
          />
        </div>
      </div>
    </main>
  );
}
