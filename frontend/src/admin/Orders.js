import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import { listOrders, getStatusValues, updateOrderStatus } from './apiAdmin';
import moment from 'moment';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [statusValues, setStatusValues] = useState([]);
  const { user, token } = isAuthenticated();

  const loadOrders = () => {
    listOrders(user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setOrders(data);
      }
    });
  };

  const loadStatusValues = () => {
    getStatusValues(user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setStatusValues(data);
      }
    });
  };

  useEffect(() => {
    loadOrders();
    loadStatusValues();
  }, []);

  const showOrdersLength = () => {
    if (orders.length > 0) {
      return (
        <h1 className='text-danger display-2'>Commandes totales: {orders.length}</h1>
      );
    } else {
      return <h1 className='text-danger'>Aucune commande
      </h1>;
    }
  };

  const showInput = (key, value) => (
    <div className='input-group mb-2 mr-sm-2'>
      <div className='input-group-prepend'>
        <div className='input-group-text'>{key}</div>
      </div>
      <input type='text' value={value} className='form-control' readOnly />
    </div>
  );

  const handleStatusChange = (e, orderId) => {
    updateOrderStatus(user._id, token, orderId, e.target.value).then((data) => {
      if (data.error) {
        console.log('La mise à jour du statut a échoué');
      } else {
        loadOrders();
      }
    });
  };

  const showStatus = (o) => (
    <div className='form-group'>
      <h3 className='mark mb-4'>Statut: {o.status}</h3>
      <select
        className='form-control'
        onChange={(e) => handleStatusChange(e, o._id)}
      >
        <option>
État de mise à jour</option>
        {statusValues.map((status, index) => (
          <option key={index} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <Layout
      title='Commandes'
      description={`Bonjour ${user.name},vous pouvez gérer toutes les commandes ici `}
    >
      <div className='row'>
        <div className='col-md-8 offset-md-2'>
          {showOrdersLength()}

          {orders.map((o, oIndex) => {
            return (
              <div
                className='mt-5'
                key={oIndex}
                style={{ borderBottom: '5px solid indigo' }}
              >
                <h2 className='mb-5'>
                  <span className='bg-primary'>numéro de commande: {o._id}</span>
                </h2>

                <ul className='list-group mb-2'>
                  <li className='list-group-item'>{showStatus(o)}</li>
                  <li className='list-group-item'>
                  identifiant de transaction: {o.transaction_id}
                  </li>
                  <li className='list-group-item'>Montant: ${o.amount}</li>
                  <li className='list-group-item'>Commandé par: {o.user.name}</li>
                  <li className='list-group-item'>
                    Ordered on: {moment(o.createdAt).fromNow()}
                  </li>
                  <li className='list-group-item'>
                    Addresse de Livraison: {o.address}
                  </li>
                </ul>

                <h3 className='mt-4 mb-4 font-italic'>
                Total des produits de la commande: {o.products.length}
                </h3>

                {o.products.map((p, pIndex) => (
                  <div
                    className='mb-4'
                    key={pIndex}
                    style={{ padding: '20px', border: '1px solid indigo' }}
                  >
                    {showInput('nom du produit', p.name)}
                    {showInput('prix du produit', p.price)}
                    {showInput('total du produit', p.count)}
                    {showInput('identifiant du produit', p._id)}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
