import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const WorkoutEdit = () => {
    const { id } = useParams(); // ✅ Get workout ID from URL
    const { user } = useAuthContext();
    const navigate = useNavigate();

    // State for the form fields
    const [title, setTitle] = useState('');
    const [load, setLoad] = useState('');
    const [reps, setReps] = useState('');
    const [error, setError] = useState(null);

    // Fetch the workout details when the component loads
    useEffect(() => {
        const fetchWorkout = async () => {
            if (!user) return;

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts/${id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            const json = await response.json();

            if (response.ok) {
                setTitle(json.title);
                setLoad(json.load);
                setReps(json.reps);
            } else {
                setError(json.error);
            }
        };

        fetchWorkout();
    }, [id, user]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedWorkout = { title, load, reps };

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            },
            body: JSON.stringify(updatedWorkout)
        });

        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
        } else {
            navigate('/'); // ✅ Redirect back to homepage after update
        }
    };

    return (
            <form onSubmit={handleSubmit} className="edit">
                <h2>Edit Workout</h2>

                <label>Title:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

                <label>Load (kg):</label>
                <input type="number" value={load} onChange={(e) => setLoad(e.target.value)} required />

                <label>Reps:</label>
                <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} required />

                <button type="submit">Update Workout</button>
                {error && <p>{error}</p>}
            </form>
    );
};

export default WorkoutEdit;
