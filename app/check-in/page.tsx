"use client";

import { useState, useEffect, useRef } from "react";

interface Guest {
  name: string;
  tableNumber: string;
}

export default function CheckInPage() {
  const [searchInput, setSearchInput] = useState("");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Fetch guests from API
  useEffect(() => {
    const fetchGuests = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/guests");
        console.log("API response status:", response);
        if (!response.ok) throw new Error("Failed to fetch guests");
        const data = await response.json();
        setGuests(data.guests);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGuests();
  }, []);

  // Filter guests based on search input
  useEffect(() => {
    if (!searchInput.trim()) {
      setFilteredGuests([]);
      setShowSuggestions(false);
      return;
    }

    const searchLower = searchInput.toLowerCase();
    const filtered = guests.filter((guest) =>
      guest.name.toLowerCase().includes(searchLower),
    );

    setFilteredGuests(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [searchInput, guests]);

  // Handle guest selection
  const handleSelectGuest = (guest: Guest) => {
    setSelectedGuest(guest);
    setSearchInput(guest.name);
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    if (showSuggestions) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showSuggestions]);

  return (
    <div className="min-h-screen bg-[url('/check-in-bg.jpg')] bg-center bg-cover from-slate-50 to-slate-100 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto my-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
            Guest Check-In
          </h1>
          <p className="text-lg text-white">
            Hãy điền tên của bạn để biết bàn của mình nhé!
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            Error: {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
            <p className="text-slate-600 mt-2">
              Đang tải danh sách khách mời...
            </p>
          </div>
        )}

        {/* Search Form */}
        {!loading && (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            {/* Search Input */}
            <div className="relative" ref={suggestionsRef}>
              <label
                htmlFor="guest-search"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Nhập tên tại đây
              </label>
              <input
                id="guest-search"
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setSelectedGuest(null);
                }}
                onFocus={() => searchInput && setShowSuggestions(true)}
                placeholder="Nhập tên của bạn..."
                className="w-full px-4 py-3 text-lg text-black border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />

              {/* Suggestions Dropdown */}
              {showSuggestions && filteredGuests.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-300 rounded-lg shadow-lg z-10">
                  <div className="max-h-64 overflow-y-auto">
                    {filteredGuests.map((guest, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectGuest(guest)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-slate-100 last:border-b-0 transition flex justify-between items-center group"
                      >
                        <span className="text-slate-900 font-medium">
                          {guest.name}
                        </span>
                        <span className="text-slate-500 text-sm group-hover:text-blue-600">
                          Table {guest.tableNumber}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No results message */}
              {showSuggestions &&
                filteredGuests.length === 0 &&
                searchInput.trim() && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-300 rounded-lg shadow-lg p-4 text-slate-600 text-center">
                    No guests found matching "{searchInput}"
                  </div>
                )}
            </div>

            {/* Result Display */}
            {selectedGuest && (
              <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                <p className="text-slate-600 text-sm font-medium mb-2">
                  Bàn của bạn là:
                </p>
                <div className="flex items-baseline gap-3">
                  <p className="text-3xl sm:text-4xl font-bold text-green-700">
                    {selectedGuest.tableNumber}
                  </p>
                  <p className="text-slate-600">
                    Chào mừng, {selectedGuest.name}!
                  </p>
                </div>
              </div>
            )}

            {/* Guest Count */}
            <div className="mt-6 text-center text-sm text-slate-500">
              {guests.length} khách mời trong hệ thống
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
