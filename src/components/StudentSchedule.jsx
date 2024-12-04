import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import withStudentAuth from './withStudentAuth';
import CoursesService from '../services/courses-service';
import RegistrationsService from '../services/registrations-service';
import './dashboard.css';

const StudentSchedule = () => {
    const [events, setEvents] = useState([]);
    const userId = parseInt(localStorage.getItem('userId'));

    const fetchStudentCourses = async () => {
        try {
            const registeredCourses = await RegistrationsService.getRegistrationsByStudentId(userId);
            console.log('Fetched registered courses:', registeredCourses);
    
            // Get all course IDs from the registered courses
            const courseIds = registeredCourses.map(registration => registration.courseId);
    
            // Fetch detailed course information for each course ID
            const coursePromises = courseIds.map(courseId => CoursesService.getCourseById(courseId));
            const courseDetails = await Promise.all(coursePromises);
            console.log('Fetched course details:', courseDetails);
    
            // Generate events for FullCalendar
            const calendarEvents = courseDetails.flatMap(course => {
                const startDate = new Date(course.startDateAt);
                const endDate = new Date(course.endDateAt);
                const events = [];
    
                // Loop through each day of the range
                for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                    const day = d.getDay();
    
                    // Check if the course is active on this day
                    if (
                        (day === 0 && course.sunday) ||
                        (day === 1 && course.monday) ||
                        (day === 2 && course.tuesday) ||
                        (day === 3 && course.wednesday) ||
                        (day === 4 && course.thursday) ||
                        (day === 5 && course.friday) ||
                        (day === 6 && course.saturday)
                    ) {
                        // Create start and end dates with correct hours
                        const start = new Date(d);
                        const end = new Date(d);
                        const [startHours, startMinutes] = course.startTimeAt.split(':').map(Number);
                        const [endHours, endMinutes] = course.endTimeAt.split(':').map(Number);
    
                        // Set the hours and minutes for local time
                        start.setHours(startHours + 7, startMinutes); // Assuming UTC+7
                        end.setHours(endHours + 7, endMinutes);
    
                        events.push({
                            title: course.courseTitle,
                            start,
                            end,
                            allDay: false,
                        });
                    }
                }
    
                return events;
            });
    
            setEvents(calendarEvents);
        } catch (error) {
            console.error('Error fetching student courses:', error);
        }
    };
    

    useEffect(() => {
        fetchStudentCourses();
    }, []);

    return (
        <div className="container">
            <h2>Your Learning Schedule</h2>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin]}
                initialView="timeGridWeek"
                events={events}
                timeZone="UTC"
                allDaySlot={false}
                minTime="08:00:00"
                maxTime="18:00:00"
                slotDuration="00:30:00"
                headerToolbar={{
                    left: 'prev,next',
                    center: 'title',
                    right: 'timeGridWeek,dayGridMonth',
                }}
            />
        </div>
    );
};

export default withStudentAuth(StudentSchedule);
