import { useEffect, useState } from 'react';
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';
import { useAuthContext } from '../hooks/useAuthContext';

// Components
import WorkoutDetails from '../components/WorkoutDetails';
import WorkoutForm from '../components/WorkoutForm';
import SearchBar from '../components/SearchBar';

const Home = () => {
    const { workouts, dispatch } = useWorkoutsContext();
    const { user } = useAuthContext();

    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('');

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

    const filteredItems = workouts
        ? workouts.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
        : [];

    const sortedWorkouts = [...filteredItems].sort((a, b) => {
        if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt); // Newest first
        if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt); // Oldest first
        if (sortBy === "title") return a.title.localeCompare(b.title); // Alphabetical
        return 0;
    });

    return (
        <div className="home">
            <div className="workouts-section">
                <div className="search-and-sort-section">
                    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    <div className="sorting">
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="" disabled>Sort by</option>
                            <option value="title">Title</option>
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                        </select>
                    </div>
                </div>

                <div className='workouts'>
                    {sortedWorkouts.length > 0 ? (
                        sortedWorkouts.map((workout) => (
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
