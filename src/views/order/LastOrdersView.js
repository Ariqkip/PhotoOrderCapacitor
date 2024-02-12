import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Container, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { AuthContext } from '../../contexts/AuthContext';
import OrderService from '../../services/OrderService';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import styled from 'styled-components';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '8px',
    width: '100%',
  },
  orderCard: {
    position: 'relative',
    padding: '4rem',
    marginBottom: '1rem',
  },
  orderNum: {
    position: 'absolute',
    top: '1rem',
    left: '1rem',
    fontWeight: 'bold'
  },
  orderLabel: {
    fontWeight: 'bold'
  },
  orderImg: {
    maxWidth: '150px'
  },
  orderImagesContainer: {
    display: 'none',
    marginTop: '1rem',
  },
  orderImagesVisible: {
    display: 'block',
  },
  orderImagesWrap: {
    display: 'flex',
    paddingTop: '2rem',
  },
  orderImgBtn: {
    border: "1px solid #4556ac",
    width: 'fit-content',
    padding: '0.5rem',
    marginLeft: '1rem',
  },
  imgWrap: {
    padding: '2rem',
  },
  noOrders: {
    color: '#fff',
    zIndex: 2,
    margin: '3rem',
  },
  notFound: {
    textAlign: 'center',
  },
  welcomeBackground: {
    position: 'absolute',
    left: '0',
    top: '0',
    height: '100%',
    width: '100%',
    backgroundColor: "#5F9EA0"
  },
}));

const S = {
  View: styled.div`
    height: 100%;
    position: relative;
    min-height: 85vh;
    padding: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
};

const LastOrdersView = () => {
  const classes = useStyles();
  const { authUser: { id } } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  const orderService = OrderService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await orderService.getAllLocalStorageOrders(id)
        const transformedData = data.map(item => ({
          ...JSON.parse(item.value || ''),
          expanded: false,
        }));
        setOrders(transformedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  const toggleImages = (index) => {
    setOrders((prevOrders) => {
      const updatedOrders = [...prevOrders];
      updatedOrders[index].expanded = !updatedOrders[index].expanded;
      return updatedOrders;
    });
  };

  const getOrderTime = (timestamp) => {
    const date = new Date(parseInt(timestamp, 10));

    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const formattedTime = `${day}${month}, ${year}, ${hours}:${minutes}:${seconds}`;
    
    return formattedTime;
  };
  
  return (
    <S.View>
      <div className={classes.welcomeBackground} />
      <Container maxWidth="md">
        <Grid container spacing={3} direction="column">
          {orders.length ? orders.map((order, key) => (
            <Grid item key={key}>
              <Card className={classes.orderCard}>
                <Typography variant="h6" gutterBottom className={classes.orderNum}>
                  №{key + 1}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <span className={classes.orderLabel}>First Name:</span> {order.FirstName}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <span className={classes.orderLabel}>Last Name:</span> {order.LastName}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <span className={classes.orderLabel}>Phone:</span> {order.Phone}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <span className={classes.orderLabel}>Email:</span>Email: {order.Email}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <span className={classes.orderLabel}>Street Address:</span> {
                    order.StreetAddress 
                      ? order.StreetAddress
                      : 'Not specified'
                  }
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <span className={classes.orderLabel}>Zip Code:</span> {
                    order.ZipCode 
                      ? order.ZipCode
                      : 'Not specified'
                  }
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <span className={classes.orderLabel}>City:</span> {
                    order.City 
                      ? order.City
                      : 'Not specified'
                  }
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <span className={classes.orderLabel}>Country:</span> {
                    order.Country 
                      ? order.Country
                      : 'Not specified'
                  }
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <span className={classes.orderLabel}>Order Id:</span> {order.OrderGuid}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <span className={classes.orderLabel}>Payment Method:</span> {
                    order.PaymentMethod 
                      ? order.PaymentMethod
                      : 'Not specified'
                  }
                </Typography>
                <Typography variant="h6" gutterBottom>
                  <span className={classes.orderLabel}>Order Time:</span> {getOrderTime(order.currentTime)}
                </Typography>

                <div className={classes.orderImagesWrap}>
                  <Typography variant="h5" gutterBottom>Order Images:</Typography>
                  <Button onClick={() => toggleImages(key)} className={classes.orderImgBtn}>
                    {order.expanded ? <RemoveIcon /> : <AddIcon />}
                  </Button>
                </div>
                <div
                  className={`${classes.orderImagesContainer} ${
                    order.expanded ? classes.orderImagesVisible : ''
                  }`}
                >
                  {order.OrderItems.map((item, index) => {
                    return (
                      <>
                        <pre>{JSON.stringify(order.OrderItems, null, 3)}</pre>
                        <div key={index} className={classes.imgWrap}>
                          {item ? (<img
                            src={item.FileUrl}
                            alt={item.FileName}
                            className={classes.orderImg}
                            />) : (
                              <div className={classes.notFound}>Image not found</div>
                              )}
                        </div>
                      </>
                    );
                  })}
                </div>
              </Card>
            </Grid>
          )) : (
            <Typography variant="h3" className={classes.noOrders}>
              You have no orders yet
            </Typography>
          )}
        </Grid>
      </Container>
    </S.View>
  );
};

export default LastOrdersView;
