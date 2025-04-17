import React from 'react';
import styled from 'styled-components';

const Card2 = ({ title, content, ctaText, month, date, icon }) => {
  return (
    <StyledWrapper>
      <div className="parent">
        <div className="card">
          <div className="content-box">
            <span className="card-title">{title || '3D Card'}</span>
            <p className="card-content">
              {content || 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'}
            </p>
            <span className="see-more">{ctaText || 'See More'}</span>
          </div>
          <div className="date-box">
            <span className="month">{month || 'JUNE'}</span>
            <span className="date">{date || '29'}</span>
            {icon && <div className="icon">{icon}</div>}
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .parent {
    width: 100%;
    padding: 20px;
    perspective: 1000px;
  }

  .card {
    padding-top: 50px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transform-style: preserve-3d;
    background: linear-gradient(135deg, #0e0e0e 18.75%, #1a1a1a 0 31.25%, #0e0e0e 0),
        repeating-linear-gradient(45deg, #1a1a1a -6.25% 6.25%, #121212 0 18.75%);
    background-size: 60px 60px;
    background-position: 0 0, 0 0;
    background-color: #121212; /* eerie-black */
    width: 100%;
    box-shadow: rgba(0, 0, 0, 0.3) 0px 30px 30px -10px;
    transition: all 0.5s ease-in-out;
    border-radius: 10px;
  }

  .card:hover {
    background-position: -100px 100px, -100px 100px;
    transform: rotate3d(0.5, 1, 0, 30deg);
  }

  .content-box {
    background: rgba(25, 93, 48, 0.9); /* hunter green with transparency */
    transition: all 0.5s ease-in-out;
    padding: 60px 25px 25px 25px;
    transform-style: preserve-3d;
    border-radius: 0 0 10px 10px;
  }

  .content-box .card-title {
    display: inline-block;
    color: white;
    font-size: 25px;
    font-weight: 900;
    transition: all 0.5s ease-in-out;
    transform: translate3d(0px, 0px, 50px);
  }

  .content-box .card-title:hover {
    transform: translate3d(0px, 0px, 60px);
  }

  .content-box .card-content {
    margin-top: 10px;
    font-size: 12px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.8);
    transition: all 0.5s ease-in-out;
    transform: translate3d(0px, 0px, 30px);
  }

  .content-box .card-content:hover {
    transform: translate3d(0px, 0px, 60px);
  }

  .content-box .see-more {
    cursor: pointer;
    margin-top: 1rem;
    display: inline-block;
    font-weight: 900;
    font-size: 9px;
    text-transform: uppercase;
    color: #121212; /* eerie-black */
    background: #10b981; /* mint */
    padding: 0.5rem 0.7rem;
    transition: all 0.5s ease-in-out;
    transform: translate3d(0px, 0px, 20px);
    border-radius: 5px;
  }

  .content-box .see-more:hover {
    transform: translate3d(0px, 0px, 60px);
  }

  .date-box {
    position: absolute;
    top: 30px;
    right: 30px;
    height: 60px;
    width: 60px;
    background: #121212; /* eerie-black */
    border: 1px solid #10b981; /* mint */
    padding: 10px;
    transform: translate3d(0px, 0px, 80px);
    box-shadow: rgba(0, 0, 0, 0.2) 0px 17px 10px -10px;
    border-radius: 5px;
  }

  .date-box span {
    display: block;
    text-align: center;
  }

  .date-box .month {
    color: #10b981; /* mint */
    font-size: 9px;
    font-weight: 700;
  }

  .date-box .date {
    font-size: 20px;
    font-weight: 900;
    color: #10b981; /* mint */
  }

  .date-box .icon {
    color: #10b981; /* mint */
    font-size: 18px;
    text-align: center;
    margin-top: 5px;
  }`;

export default Card2;

