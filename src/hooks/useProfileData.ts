

import { useEffect, useState } from "react";

export interface ProfileData {
  id: string;
  name: string;
  username: string;
  role: number;
  joinDate: string;
  email: string;
}

interface Story {
  id: number;
  title: string;
  author_username: string;
  date: string;
  description: string;
}

export const useProfileData = (targetUsername: string | undefined) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const profileRes = await fetch(
          `http://localhost:3000/api/users/username/${targetUsername}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (profileRes.status === 404) {
          setProfile(null);
          setStories([]);
          return;
        }

        if (!profileRes.ok) throw new Error("Failed to fetch profile.");
        const profileData = await profileRes.json();
        setProfile(profileData);

        const storiesRes = await fetch(
          `http://localhost:3000/api/stories/author/${targetUsername}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (storiesRes.status === 404) {
          setStories([]);
          return;
        }

        if (!storiesRes.ok) throw new Error("Failed to fetch stories.");
        const storiesData = await storiesRes.json();
        setStories(storiesData);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("An unknown error occurred.");
      }
    };

    if (targetUsername) fetchData();
  }, [targetUsername]);

  return { profile, stories, error, setProfile };
};
