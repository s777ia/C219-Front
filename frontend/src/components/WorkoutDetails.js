import { useWorkoutsContext } from '../hooks/useWorkoutsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { Link } from 'react-router-dom'; // ✅ Import Link for navigation

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const WorkoutDetails = ({ workout }) => {
    const { dispatch } = useWorkoutsContext()
    const { user } = useAuthContext()

    const handleClick = async () => {
        // const response = await fetch('/api/workouts/' + workout._id, {
        //     method: "DELETE"
        // })

        if (!user) {
            return
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts/${workout._id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            dispatch({ type: "DELETE_WORKOUT", payload: json })
        }
    }

    return (
        <div className="workout-details">
            <h4>{workout.title}</h4>
            <p><strong>Load (kg): </strong>{workout.load}</p>
            <p><strong>Reps: </strong>{workout.reps}</p>
            <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>
            <div className="workout-actions">
                <Link to={`/edit/${workout._id}`}>
                    <span className="material-symbols-outlined edit-icon">edit</span>
                </Link>
                <span className="material-symbols-outlined delete-icon" onClick={handleClick}>
                    delete
                </span>
            </div>
        </div>
    )
}

export default WorkoutDetails;