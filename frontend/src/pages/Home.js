import { useEffect, useState } from 'react';
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';
import { useAuthContext } from '../hooks/useAuthContext';

// components
import WorkoutDetails from '../components/WorkoutDetails';
import WorkoutForm from '../components/WorkoutForm';
import SearchBar from '../components/SearchBar';

const Home = () => {
    const { workouts, dispatch } = useWorkoutsContext();
    const { user } = useAuthContext();

    const [searchQuery, setSearchQuery] = useState('');

    // ✅ Fix: Filter through `workouts` correctly
    const filteredItems = workouts
        ? workouts.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
        : [];

    useEffect(() => {
        const fetchWorkouts = async () => {
            if (!user) return;

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });

            const json = await response.json();

            if (response.ok) {
                dispatch({ type: "SET_WORKOUTS", payload: json });
            }
        };

        fetchWorkouts();
    }, [dispatch, user]);

    return (
        <div className="home">
            <div>
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

                <div className='workouts'>
                    {/* ✅ Display filtered workouts */}
                    {filteredItems.length > 0 ? (
                        filteredItems.map((workout) => (
                            <WorkoutDetails key={workout._id} workout={workout} />
                        ))
                    ) : (
                        <p>No workouts found.</p>
                    )}
                </div>
            </div>
            <WorkoutForm />
        </div>
    );
};

export default Home;
