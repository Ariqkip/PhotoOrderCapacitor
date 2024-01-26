import React, { ComponentType, useContext, useEffect, useState } from 'react';
import { Button, Card, Container, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { AuthContext } from '../../contexts/AuthContext';
import OrderService from '../../services/OrderService';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import styled from 'styled-components';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

const useStyles = makeStyles((theme) => ({
  root: {
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
    margin: '3rem',
  },
  notFound: {
    textAlign: 'center',
  }
}));

const S = {
  View: styled.div`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
};

// const IMAGE_DIR = 'stored-images';

const LastOrdersView = () => {
  const classes = useStyles();
  const { authUser: { id } } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  // const [images, setImages] = useState([]);

  const orderService = OrderService();

  // const loadFiles = async () => {
  //   Filesystem.readdir({
  //     directory: Directory.Data,
  //     path: IMAGE_DIR
  //   }).then(result => {
  //     console.log('REsult', result)
  //     loadFileData(result.files)
  //   }, async error => {
  //     console.log('Error', error);
  //     Filesystem.mkdir({
  //       directory: Directory.Data,
  //       path: IMAGE_DIR
  //     })
  //   })
  // }

  // const loadFileData = async (fileNames) => {
  //   const updatedImages = [];
  
  //   for (let f of fileNames) {
  //     const filePath = `${IMAGE_DIR}/${f.name}`;
  //     try {
  //       const readFile = await Filesystem.readFile({
  //         directory: Directory.Data,
  //         path: filePath
  //       });
  
  //       updatedImages.push({
  //         name: f,
  //         path: filePath,
  //         data: readFile.data
  //       });
  //     } catch (error) {
  //       console.error(`Error reading file ${filePath}:`, error);
  //     }
  //   }
  
  //   setImages(images => [...images, ...updatedImages]);
  // };

  // const getStoredImageData = (fileName) => {
  //   const cleanedFileName = fileName.replace('/DATA/', '');
  //   const foundImage = images.find(image => cleanedFileName.startsWith(image.path));
  //   return foundImage ? foundImage.data : null;
  // };

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
    
    // loadFiles();
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
                    // const base64String = btoa(images[0]?.data);

                    // const imageData = getStoredImageData(item.SavedFiles.uri);
                    return (
                      <div key={index} className={classes.imgWrap}>
                        {/* <h1>images[0]:</h1>
                        <pre>{JSON.stringify(images[0], null, 2)}</pre>

                        <h1>item:</h1>
                        <pre>{JSON.stringify(item, null, 2)}</pre>
                        <img src={item.SavedFiles.uri} alt={item.FileName} className={classes.orderImg} /> */}
                        {item ? (<img
                          src={item.FileUrl}
                          alt={item.FileName}
                          className={classes.orderImg}
                        />) : (
                          <div className={classes.notFound}>Image not found</div>
                        )}
                      </div>
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
