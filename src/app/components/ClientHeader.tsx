"use client";
import { useState, useEffect, useRef } from "react";
import Logo from "./Logo";
import { IoLocationOutline } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { SlBasket } from "react-icons/sl";
import { GoPerson } from "react-icons/go";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

export default function ClientHeader() {
  const [basket, setBasket] = useState<string[]>([]);
  const [showBasket, setShowBasket] = useState(false);
  const [location, setLocation] = useState<string>("Please enter location");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingBasket, setLoadingBasket] = useState(false);
  const [error, setError] = useState("");
  const basketRef = useRef<HTMLDivElement>(null);

  const toggleBasket = () => setShowBasket((prev) => !prev);

  const removeItem = (index: number) => {
    setBasket((prev) => prev.filter((_, i) => i !== index));
  };

  const getLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoadingLocation(true);

    const geoSuccess = async (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          { timeout: 1000 }
        );
        setLocation(response.data.display_name || "Location not found");
      } catch (error) {
        console.error("Error fetching location:", error);
        setLocation("Error retrieving location");
      } finally {
        setLoadingLocation(false);
      }
    };

    const geoError = (error: GeolocationPositionError) => {
      console.error("Geolocation error:", error);
      setLocation("Unable to retrieve location");
      setLoadingLocation(false);
    };

    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, { timeout: 3000 });
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingBasket(true);
      setError("");
      try {
        const response = await axios.get(`${API_URL}/order`, { timeout: 10000 });
        setBasket(response.data.orders);
      } catch (err) {
        setError("Error fetching food orders!");
      } finally {
        setLoadingBasket(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (basketRef.current && !basketRef.current.contains(event.target as Node)) {
        setShowBasket(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex w-full m-auto max-w-[1200px] bg-black">
      <div className="flex items-center justify-between w-full">
        <Logo className="w-[20%] sm:w-[20%] text-white" />
        <div className="flex w-[50%] gap-2 justify-around">
          <div className="bg-white h-10 flex max-w-[320px] w-full sm:w-[80%] items-center text-black rounded-2xl relative">
            <IoLocationOutline className="text-xl text-red-500 ml-2" />
            <p className="text-sm w-[120px] text-red-600">Delivery address:</p>
            <input
              className="text-black w-[70%] mr-8 pr-4 px-4 py-1 rounded-2xl border-none focus:outline-none"
              placeholder="Add Location"
              value={loadingLocation ? "Fetching..." : location}
              readOnly
            />
            <button onClick={getLocation} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
              <IoIosArrowForward />
            </button>
          </div>
          <div
            className="relative text-black bg-white rounded-full h-10 w-10 flex justify-center items-center cursor-pointer"
            onClick={toggleBasket}
            ref={basketRef}
          >
            <SlBasket className="z-10" />
            {basket.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                {basket.length}
              </span>
            )}
          </div>
          {showBasket && (
            <div className="absolute top-12 right-10 bg-white p-4 shadow-lg rounded-lg w-60">
              {basket.length === 0 ? (
                <p className="text-black text-center">Basket is empty</p>
              ) : (
                <ul>
                  {basket.map((item, index) => (
                    <li key={index} className="flex justify-between items-center border-b py-2">
                      <span className="text-black">{item}</span>
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <div className="text-white flex items-center justify-center bg-red-500 w-10 h-10 rounded-full">
            <GoPerson />
          </div>
        </div>
      </div>
    </div>
  );
}
