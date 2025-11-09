/**
 * @name Hotel Room Booking System
 * @author Md. Samiur Rahman (Mukul)
 * @description Hotel Room Booking and Management System Software ~ Developed By Md. Samiur Rahman (Mukul)
 * @copyright ©2023 ― Md. Samiur Rahman (Mukul). All rights reserved.
 * @version v0.0.1
 *
 */

import { Empty, Result, Skeleton } from 'antd';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Banner from '../../components/home/Banner';
import Hero from '../../components/home/Hero';
import MainLayout from '../../components/layout';
import RoomFilter from '../../components/rooms/RoomsFilter';
import RoomList from '../../components/rooms/RoomsList';

// Use environment variable for API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

function Rooms(props) {
  const [ourRooms, setOurRooms] = useState([]);
  const [ourFilteredRooms, setOurFilteredRooms] = useState([]);

  // if props rooms exists to setOurRooms
  useEffect(() => {
    if (props?.rooms) {
      setOurRooms(props?.rooms?.data?.rows);
      setOurFilteredRooms(props?.rooms?.data?.rows);
    }
  }, [props]);

  return (
    <MainLayout title='Beach Resort ― Rooms'>
      <Hero hero='roomsHero'>
        <Banner title='our rooms'>
          <Link className='btn-primary' href='/'>
            return home
          </Link>
        </Banner>
      </Hero>

      {/* featured rooms */}
      <Skeleton loading={!props?.rooms && !props?.error} paragraph={{ rows: 10 }} active>
        {props?.rooms?.data?.rows?.length === 0 ? (
          <Empty
            className='mt-10'
            description={(<span>Sorry! Any data was not found.</span>)}
          />
        ) : props?.error ? (
          <Result
            title='Failed to fetch'
            subTitle={props?.error?.message || 'Sorry! Something went wrong. App server error'}
            status='error'
          />
        ) : (
          <>
            <RoomFilter
              ourRooms={ourRooms}
              setOurFilteredRooms={setOurFilteredRooms}
            />
            <RoomList
              rooms={ourFilteredRooms}
            />
          </>
        )}
      </Skeleton>
    </MainLayout>
  );
}

export async function getServerSideProps() {
  try {
    // Log the URL being called (for debugging)
    console.log('Fetching rooms from:', `${API_BASE_URL}/api/v1/all-rooms-list`);

    const response = await axios.get(`${API_BASE_URL}/api/v1/all-rooms-list`);
    console.log('API Response:', response?.data); // Debug log

    if (!response?.data?.result) {
      throw new Error('Invalid response format from API');
    }

    return {
      props: {
        rooms: response?.data?.result,
        error: null
      }
    };
  } catch (err) {
    // Detailed error logging
    console.error('Error fetching rooms:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    });

    const errorPayload = {
      message: err.response?.data?.message || err.message || 'Failed to fetch rooms',
      status: err.response?.status || 500
    };

    return {
      props: {
        rooms: null,
        error: errorPayload
      }
    };
  }
}

export default Rooms;
