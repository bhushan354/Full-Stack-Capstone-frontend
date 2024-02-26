import React, { useEffect } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useParams } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { fetchDetailItem } from '../redux/ItemDeatils';
// eslint-disable-next-line import/no-extraneous-dependencies
import style from '../styles/Vehicles.module.css';
import { reserveItem } from '../redux/reservationsSlice';

function CarDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const itemDetailsData = useSelector((state) => state.itemDetail.itemDetail.item);

  useEffect(() => {
    if (id) {
      dispatch(fetchDetailItem(id)).unwrap();
    }
  }, [id, dispatch]);

  if (!itemDetailsData || !user) {
    return <p>Loading...</p>;
  }

  const handleReserve = () => {
    const requestData = {
      customer_id: user.id,
      reserve_for_use_date: new Date().toISOString().split('T')[0],
      city: itemDetailsData.city,
    };

    axios.post('http://localhost:3000/api/v1/reservations', requestData)
      .then((response) => {
        dispatch(reserveItem(response.data));
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error reserving item:', error);
      });
  };

  return (
    <div className={style['section-item-details']}>
      <div className={style['details-img']}>
        <img src={itemDetailsData.image} alt={itemDetailsData.name} />
      </div>
      <div className={style['details-des']}>
        <p className={style['details-name']}>{itemDetailsData.name}</p>
        <div className={style['details-info']}>
          <p className={style['dark-bg']}>
            <span>City:</span>
            <span>{itemDetailsData.city}</span>
          </p>
          <p>
            <span>Finance Fee:</span>
            <span>{itemDetailsData.financeFee}</span>
          </p>
          <p className={style['dark-bg']}>
            <span>Purchase Fee:</span>
            <span>{itemDetailsData.purchaseFee}</span>
          </p>
          <p>
            <span>Total Payable:</span>
            <span>{itemDetailsData.totalAmount}</span>
          </p>
          <p className={style['dark-bg']}>
            <span>Duration:</span>
            <span>{itemDetailsData.duration}</span>
          </p>
          <p>
            <span>APR Representative:</span>
            <span>{itemDetailsData.apr}</span>
          </p>
        </div>
        <p>
          Your total reservation
          {' '}
          {itemDetailsData.reservation_count}
        </p>
        <form className={style['reserve-form']} onSubmit={handleReserve}>
          <button type="submit">Reserve</button>
        </form>
        <button className={style['cancel-reservation']} type="button">
          Cancel Reservation
        </button>
        <button className={style['add-new']} type="button">
          Add new
        </button>
      </div>
    </div>
  );
}

export default CarDetail;
