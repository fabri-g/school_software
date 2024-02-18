// pages/rooms.js
import React, { useState } from 'react';
import AddRoomModal from '../components/form/room-modal';

// Fetch function to get data from the API
async function fetchRoomsData() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms`);
  if (!response.ok) {
    throw new Error('Failed to fetch rooms');
  }
  const data = await response.json();
  return data;
}

export async function getServerSideProps(context) {
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

  return (
    <>
      <div className="flex justify-between items-center mx-6 my-4">
        <h1 className="text-3xl font-semibold">Rooms</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowAddRoomModal(true)}
        >
          Add +
        </button>
      </div>
        {rooms.map((room) => (
          <div key={room.id} className="max-w-xl mx-auto bg-gray-100 p-4 my-4 rounded-lg shadow">
            <h2 className="text-xl font-bold">{room.name}</h2>
            <p>Number of Students: {room.currentCapacity}</p>
            {/* Add more room details here */}
          </div>
        ))}
      <AddRoomModal
        isOpen={showAddRoomModal}
        onClose={() => setShowAddRoomModal(false)}
        onAddRoom={addRoom}
      />
    </>
  );
};

export default Rooms;
