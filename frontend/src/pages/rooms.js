// pages/rooms.js
import React, { useState, useEffect } from 'react';
import AddRoomModal from '../components/form/room-modal';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { handleAuthClick } from '../helpers/authActions';
import { debounce } from '../utils/debounce';


// Fetch function to get data from the API
async function fetchRoomsData(searchTerm = '') {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms${searchTerm ? `?name=${searchTerm}` : ''}`);
  if (!response.ok) {
    throw new Error('Failed to fetch rooms');
  }
  const data = await response.json();
  return data;
}

export async function getServerSideProps() {
  try {
    const roomsData = await fetchRoomsData();
    return {
      props: { initialRooms: roomsData }, // Pass rooms data as props to the page
    };
  } catch (error) {
    console.error("Error fetching rooms data:", error);
    return {
      props: { initialRooms: [] }, // Return empty data on error
    };
  }
}

const Rooms = ({ initialRooms }) => {
  const [rooms, setRooms] = useState(initialRooms);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const { currentUser, loading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const addRoom = async (roomData) => {
    // API call to add room
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roomData),
    });

    // Close modal
    setShowAddRoomModal(false);

    // Fetch updated list of rooms
    const updatedRooms = await fetchRoomsData();
    setRooms(updatedRooms);
  };

  const handleAddClick = handleAuthClick(() => setShowAddRoomModal(true), loading, currentUser, router);

  useEffect(() => {
    const debouncedSearch = debounce(() => fetchAndSetRooms(searchTerm), 500);
    debouncedSearch();
  } , [searchTerm]);

  const fetchAndSetRooms = async (searchValue) => {
    const updatedRooms = await fetchRoomsData(searchValue);
    setRooms(updatedRooms);
  }

  return (
    <>
      <div className="mx-6 my-4">
        <h1 className="text-3xl font-semibold mb-4">Rooms</h1>
        <div className="flex justify-between mb-4">
          <div className="flex items-center space-x-2">
            <img src="/assets/images/loupe.png" alt="Search" className="w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name"
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 p-2 rounded"
            />
          </div>
          <button
            style={{backgroundColor: '#6367E3'}}
            className="text-white font-bold py-2 px-4 rounded"
            onClick={handleAddClick}>
            Add +
          </button>
        </div>
      </div>
      <div className="mx-6">
        {rooms.map((room) => (
          <Link key={room.id} href={`/rooms/${room.id}`} passHref>
            <div className="block bg-gray-100 p-4 my-4 rounded-lg shadow">
              <h2 className="text-xl font-bold">{room.name}</h2>
              <p>Number of Students: {room.currentCapacity}</p>
          </div>
          </Link>
        ))}
      </div>
      <AddRoomModal
        isOpen={showAddRoomModal}
        onClose={() => setShowAddRoomModal(false)}
        onAddRoom={addRoom}
      />
    </>
  );
};

export default Rooms;
