import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const StudentDashboard = () => {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState("my-courses");
  const [myCourses, setMyCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchMyCourses();
    fetchAvailableCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/student/courses",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setMyCourses(data);
      }
    } catch (error) {
      setMessage("Error fetching courses");
    }
  };

  const fetchAvailableCourses = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/student/available-courses",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAvailableCourses(data);
      }
    } catch (error) {
      setMessage("Error fetching available courses");
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/auth/student/courses/${courseId}/enroll`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        setMessage("Successfully enrolled in course");
        fetchMyCourses();
        fetchAvailableCourses();
      } else {
        const data = await response.json();
        setMessage(data.error);
      }
    } catch (error) {
      setMessage("Error enrolling in course");
    }
  };

  const handleViewCourseDetails = async (courseId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/auth/student/courses/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSelectedCourse(data);
        setActiveTab("course-details");
      }
    } catch (error) {
      setMessage("Error fetching course details");
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <div className="flex items-center gap-4">
          <span>Welcome, {user?.username}</span>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-600 rounded">
          {message}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="mb-6 border-b">
        <nav className="flex space-x-4">
          <button
            onClick={() => {
              setActiveTab("my-courses");
              setSelectedCourse(null);
            }}
            className={`px-4 py-2 ${
              activeTab === "my-courses" ? "border-b-2 border-purple-500" : ""
            }`}
          >
            My Courses
          </button>
          <button
            onClick={() => {
              setActiveTab("available-courses");
              setSelectedCourse(null);
            }}
            className={`px-4 py-2 ${
              activeTab === "available-courses"
                ? "border-b-2 border-purple-500"
                : ""
            }`}
          >
            Available Courses
          </button>
          {selectedCourse && (
            <button
              onClick={() => setActiveTab("course-details")}
              className={`px-4 py-2 ${
                activeTab === "course-details"
                  ? "border-b-2 border-purple-500"
                  : ""
              }`}
            >
              Course Details
            </button>
          )}
        </nav>
      </div>

      {/* My Courses Tab */}
      {activeTab === "my-courses" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myCourses.map((course) => (
            <div
              key={course._id}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold">{course.courseName}</h3>
              <p className="text-gray-600">{course.courseCode}</p>
              <p className="text-gray-500 text-sm mt-2">
                Teacher: {course.teacher?.username}
              </p>
              <button
                onClick={() => handleViewCourseDetails(course._id)}
                className="mt-2 text-purple-600 hover:text-purple-800"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Available Courses Tab */}
      {activeTab === "available-courses" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableCourses.map((course) => (
            <div
              key={course._id}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold">{course.courseName}</h3>
              <p className="text-gray-600">{course.courseCode}</p>
              <p className="text-gray-500 text-sm mt-2">
                Teacher: {course.teacher?.username}
              </p>
              <button
                onClick={() => handleEnroll(course._id)}
                className="mt-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Enroll
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Course Details Tab */}
      {activeTab === "course-details" && selectedCourse && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold mb-4">
              {selectedCourse.courseName}
            </h2>
            <p className="text-gray-600 mb-2">
              Code: {selectedCourse.courseCode}
            </p>
            <p className="text-gray-600 mb-4">{selectedCourse.description}</p>
            <p className="text-gray-600">
              Teacher: {selectedCourse.teacher?.username}
            </p>

            {/* Zoom Links Section */}
            <div className="mt-6">
              <h3 className="font-semibold mb-4">Zoom Sessions</h3>
              {selectedCourse.zoomLinks?.length > 0 ? (
                <div className="space-y-3">
                  {selectedCourse.zoomLinks.map((zoomLink) => (
                    <div key={zoomLink._id} className="border rounded p-3">
                      <h4 className="font-medium">{zoomLink.topic}</h4>
                      <p className="text-sm text-gray-500 mb-2">
                        {new Date(zoomLink.date).toLocaleString()}
                      </p>
                      <a
                        href={zoomLink.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 text-white px-4 py-2 rounded inline-block hover:bg-blue-600"
                      >
                        Join Meeting
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No zoom sessions scheduled</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
