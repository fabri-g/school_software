// pages/students/[id].js
import React, { useState } from 'react';
import Link from 'next/link';
import EditStudentModal from '../../components/form/edit-student-modal';
import ConfirmationDialog from '../../components/form/delete-confirmation';
import { useRouter } from 'next/router';

export async function getServerSideProps({ params }) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students/${params.id}`);
    if(!res.ok) {
      throw new Error(`Failed to fetch student with id ${params.id}, status code: ${res.status}`);
    }
    const student = await res.json();
    return {
      props: { student },
    };
  } catch (error) {
    console.error(error);
    return {
      props: { error: error.message },
    };
  }
}

const StudentDetails = ({ student, error }) => {
  const router = useRouter();
  if (error) {
    return <p>Error loading student details: {error}</p>;
  }
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const editStudent = async (studentData) => {
    // API call to edit student
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students/${student.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    //Reload to show updated information
    location.reload();
  }

  const handleDeleteStudent = async () => {
    try{
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students/${student.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete student with id ${student.id}, status code: ${response.status}`);
      }

      // Handle success
      console.log("Student deleted successfully");
      router.push('/students'); // Redirect to the list of students
      // If you're on a student details page, redirect back to the list
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div style={{ marginLeft: '40px', marginTop: '30px', lineHeight: '2' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1 className="text-3xl font-semibold">{student.name}</h1>
        <button
          style={{ marginLeft: '50px' }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowEditStudentModal(true)}>Edit</button>
        <button
          style={{ marginLeft: '30px' }}
          className= "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowDeleteConfirmation(true)}>Delete</button>
      </div>
      <p style={{ marginTop: '20px' }}>Age: {student.age}</p>
      <p>Gender: {student.gender}</p>
      <p>Address: {student.address}</p>
      <p>Room: {student.room ? (
        <Link href={`/rooms/${student.room.id}`} className="text-blue-500 hover:text-blue-800">
          {student.room.name}
        </Link>
      ) : "No room assigned"}
      </p>
      <p> Siblings:</p>
      {student.siblings && student.siblings.length > 0 ? (
      <ul>
        {student.siblings.map(sibling => (
          <li key={sibling.id}>
            <Link href={`/students/${sibling.id}`} className="text-blue-500 hover:text-blue-800">
              {sibling.name}
            </Link>
          </li>
        ))}
      </ul>
      ): (
        <p>No siblings listed.</p>
      ) }
      <EditStudentModal
        isOpen={showEditStudentModal}
        onClose={() => setShowEditStudentModal(false)}
        onEditStudent={editStudent}
        existingStudent={student}
      />
      <ConfirmationDialog
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDeleteStudent} // Implement this function to handle the deletion
      />
    </div>
  );
};

export default StudentDetails;
