'use client';

import { useEffect, useState } from 'react';

interface Follower {
  full_name: string;
  id: string;
  is_private: boolean;
  is_verified: boolean;
  latest_story_ts: number;
  profile_pic_url: string;
  username: string;
}

interface Like {
  username: string;
}

export default function Home() {
  const [postUrl, setPostUrl] = useState<string>('');
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [likes, setLikes] = useState<Like[]>([]);
  const [filteredLikesCount, setFilteredLikesCount] = useState<number>(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostUrl(e.target.value);
  };

  const fetchFollowers = async () => {
    try {
      const response = await fetch('https://instagram-scraper-api2.p.rapidapi.com/v1/followers?username_or_id_or_url=gas.solution.official&amount=1000', {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '23380cf958mshacfe5b08a78621ap1efa9ejsnf3a75df334e7',
          'x-rapidapi-host': 'instagram-scraper-api2.p.rapidapi.com'
        }
      });
      const result = await response.json();
      console.log('Followers API response:', result);
      return result.data.items || [];
    } catch (error) {
      console.error('Error fetching followers:', error);
      return [];
    }
  };

  const fetchLikes = async (url: string) => {
    try {
      const response = await fetch(`https://instagram-scraper-api2.p.rapidapi.com/v1/likes?code_or_id_or_url=${url}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '23380cf958mshacfe5b08a78621ap1efa9ejsnf3a75df334e7',
          'x-rapidapi-host': 'instagram-scraper-api2.p.rapidapi.com'
        }
      });
      const result = await response.json();
      console.log('Likes API response:', result);
      return result.data.items || [];
    } catch (error) {
      console.error('Error fetching likes:', error);
      return [];
    }
  };

  const handleSubmit = async () => {
    setFilteredLikesCount(0); // Reset count before fetching
    const [fetchedFollowers, fetchedLikes] = await Promise.all([
      fetchFollowers(),
      fetchLikes(postUrl)
    ]);
    console.log('Fetched Followers:', fetchedFollowers); // Check fetched followers
    console.log('Fetched Likes:', fetchedLikes); // Check fetched likes
    setFollowers(fetchedFollowers);
    setLikes(fetchedLikes);
  };

  useEffect(() => {
    if (followers.length > 0 && likes.length > 0) {
      console.log('Followers:', followers); // Log followers data
      console.log('Likes:', likes); // Log likes data

      const followerUsernames = followers.map(follower => follower.username);
      const filtered = likes.filter(like => followerUsernames.includes(like.username));

      console.log('Filtered Likes:', filtered); // Log the filtered likes

      setFilteredLikesCount(filtered.length); // Count the filtered likes
    }
  }, [followers, likes]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Instagram Like Filter</h1>
      <input
        type="text"
        value={postUrl}
        onChange={handleInputChange}
        placeholder="Enter Instagram Post URL"
        className="border p-2 mb-4 w-full"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Filter Likes
      </button>
      <h2 className="text-lg font-semibold mt-6">Filtered Likes from Followers</h2>
      <p className="font-semibold">Total: {filteredLikesCount}</p>
    </div>
  );
}
