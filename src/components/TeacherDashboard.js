import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const TeacherDashboard = () => {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState("courses");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [message, setMessage] = useState("");

  // Course Modal State
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    courseName: "",
    courseCode: "",
    description: "", // Added description field to match backend
  });

  const [showZoomModal, setShowZoomModal] = useState(false);
  const [newZoomLink, setNewZoomLink] = useState({
    topic: "",
    link: "",
    date: "",
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/teacher/courses",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      } else {
        throw new Error("Failed to fetch courses");
      }
    } catch (error) {
      setMessage("Error fetching courses");
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/teacher/courses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(newCourse),
          credentials: "include",
        }
      );

      if (response.ok) {
        setMessage("Course created successfully");
        setShowCourseModal(false);
        setNewCourse({ courseName: "", courseCode: "", description: "" });
        fetchCourses();
      } else {
        const data = await response.json();
        setMessage(data.error);
      }
    } catch (error) {
      setMessage("Error creating course");
    }
  };

  const handleViewCourseDetails = async (courseId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/auth/teacher/courses/${courseId}`,
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
      } else {
        throw new Error("Failed to fetch course details");
      }
    } catch (error) {
      setMessage("Error fetching course details");
    }
  };

  const handleAddZoomLink = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/api/auth/teacher/courses/${selectedCourse._id}/zoom-links`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(newZoomLink),
          credentials: "include",
        }
      );

      if (response.ok) {
        setMessage("Zoom link added successfully");
        setShowZoomModal(false);
        setNewZoomLink({ topic: "", link: "", date: "" });
        handleViewCourseDetails(selectedCourse._id);
      } else {
        const data = await response.json();
        setMessage(data.error);
      }
    } catch (error) {
      setMessage("Error adding zoom link");
    }
  };

  const handleDeleteZoomLink = async (linkId) => {
    if (window.confirm("Are you sure you want to delete this zoom link?")) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/auth/teacher/courses/${selectedCourse._id}/zoom-links/${linkId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            credentials: "include",
          }
        );

        if (response.ok) {
          setMessage("Zoom link deleted successfully");
          handleViewCourseDetails(selectedCourse._id);
        } else {
          const data = await response.json();
          setMessage(data.error);
        }
      } catch (error) {
        setMessage("Error deleting zoom link");
      }
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
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
              setActiveTab("courses");
              setSelectedCourse(null);
            }}
            className={`px-4 py-2 ${
              activeTab === "courses" ? "border-b-2 border-purple-500" : ""
            }`}
          >
            Courses
          </button>
          {selectedCourse && (
            <button
              onClick={() => setActiveTab("details")}
              className={`px-4 py-2 ${
                activeTab === "details" ? "border-b-2 border-purple-500" : ""
              }`}
            >
              Course Details
            </button>
          )}
        </nav>
      </div>

      {/* Courses Tab */}
      {activeTab === "courses" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Courses</h2>
            <button
              onClick={() => setShowCourseModal(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Create New Course
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div
                key={course._id}
                className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-bold">{course.courseName}</h3>
                <p className="text-gray-600">{course.courseCode}</p>
                <p className="text-gray-500 text-sm mt-2">
                  {course.description}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {course.students?.length || 0} Students
                </p>
                <button
                  onClick={() => {
                    handleViewCourseDetails(course._id);
                    setActiveTab("details");
                  }}
                  className="mt-2 text-purple-600 hover:text-purple-800"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Course Details Tab */}
      {activeTab === "details" && selectedCourse && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow">
            {/* ... existing course details ... */}

            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Zoom Links</h3>
                <button
                  onClick={() => setShowZoomModal(true)}
                  className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                >
                  Add Zoom Link
                </button>
              </div>

              {selectedCourse.zoomLinks?.length > 0 ? (
                <div className="space-y-3">
                  {selectedCourse.zoomLinks.map((zoomLink) => (
                    <div
                      key={zoomLink._id}
                      className="border rounded p-3 flex justify-between items-start"
                    >
                      <div>
                        <h4 className="font-medium">{zoomLink.topic}</h4>
                        <a
                          href={zoomLink.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Join Meeting
                        </a>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(zoomLink.date).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteZoomLink(zoomLink._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No zoom links added yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Zoom Link Modal */}
      {showZoomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Add Zoom Link</h3>
            <form onSubmit={handleAddZoomLink} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Topic</label>
                <input
                  type="text"
                  value={newZoomLink.topic}
                  onChange={(e) =>
                    setNewZoomLink({ ...newZoomLink, topic: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Zoom Link
                </label>
                <input
                  type="url"
                  value={newZoomLink.link}
                  onChange={(e) =>
                    setNewZoomLink({ ...newZoomLink, link: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                  placeholder="https://zoom.us/j/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={newZoomLink.date}
                  onChange={(e) =>
                    setNewZoomLink({ ...newZoomLink, date: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowZoomModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Add Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Create New Course</h3>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  value={newCourse.courseName}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, courseName: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  value={newCourse.courseCode}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, courseCode: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={newCourse.description}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, description: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                  rows="3"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
