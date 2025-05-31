import styled, { css } from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
`;

export const DateFilter = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const DateFilterTitle = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #3e3e3e;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: "date_range";
    font-family: 'Material Icons Round';
    color: #ea1d2c;
  }
`;

export const DateFilterOptions = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    justify-content: flex-start;
    flex-wrap: nowrap;
  }
`;

export const DateOption = styled.div`
  background-color: ${props => props.active ? '#ea1d2c' : '#f2f2f2'};
  color: ${props => props.active ? 'white' : '#3e3e3e'};
  border: 1px solid ${props => props.active ? '#ea1d2c' : '#e4e4e4'};
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.active ? '#c41020' : '#e4e4e4'};
  }
`;

export const CustomDateRange = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const CustomDateInput = styled.div`
  flex: 1;
  min-width: 140px;

  label {
    display: block;
    margin-bottom: 4px;
    font-size: 12px;
    color: #a6a6a6;
  }

  input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #e4e4e4;
    border-radius: 8px;
    font-size: 14px;
   transition: all 0.3s ease;

   &:focus {
     outline: none;
     border-color: #ea1d2c;
     box-shadow: 0 0 0 2px rgba(234, 29, 44, 0.2);
   }
 }
`;

export const ApplyDateBtn = styled.button`
 background-color: #ea1d2c;
 color: white;
 border: none;
 padding: 10px 20px;
 border-radius: 8px;
 font-weight: 600;
 cursor: pointer;
 align-self: flex-end;
 transition: all 0.3s ease;

 &:hover {
   background-color: #c41020;
 }
`;

export const TabNavigation = styled.div`
 display: flex;
 background-color: white;
 border-radius: 12px;
 margin-bottom: 20px;
 overflow: hidden;
 box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

export const Tab = styled.div`
 flex: 1;
 text-align: center;
 padding: 16px;
 cursor: pointer;
 border-bottom: 3px solid ${props => props.active ? '#ea1d2c' : 'transparent'};
 color: ${props => props.active ? '#ea1d2c' : '#3e3e3e'};
 font-weight: ${props => props.active ? '600' : '500'};
 transition: all 0.3s ease;
 display: flex;
 flex-direction: column;
 align-items: center;
 gap: 4px;

 &:hover {
   background-color: #f8f8f8;
 }
`;

export const TabIcon = styled.span`
 font-family: 'Material Icons Round';
 font-size: 24px;
`;

export const TabContent = styled.div`
 display: ${props => props.active ? 'block' : 'none'};
 animation: ${props => props.active ? 'fadeIn 0.3s ease' : 'none'};

 @keyframes fadeIn {
   from {
     opacity: 0;
     transform: translateY(10px);
   }
   to {
     opacity: 1;
     transform: translateY(0);
   }
 }
`;

export const SearchBar = styled.div`
 display: flex;
 margin-bottom: 20px;
 position: relative;
`;

export const SearchIcon = styled.span`
 position: absolute;
 left: 16px;
 top: 50%;
 transform: translateY(-50%);
 color: #a6a6a6;
 font-family: 'Material Icons Round';
`;

export const SearchInput = styled.input`
 flex: 1;
 padding: 12px 16px 12px 44px;
 border: 1px solid #e4e4e4;
 border-radius: 12px;
 font-size: 14px;
 transition: all 0.3s ease;

 &:focus {
   outline: none;
   border-color: #ea1d2c;
   box-shadow: 0 0 0 2px rgba(234, 29, 44, 0.1);
 }
`;

export const Card = styled.div`
 background-color: white;
 border-radius: 12px;
 box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
 margin-bottom: 24px;
 overflow: hidden;
 transition: all 0.3s ease;

 &:hover {
   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
   transform: translateY(-2px);
 }
`;

export const CardHeader = styled.div`
 padding: 20px;
 border-bottom: 1px solid #f1f1f1;
 font-weight: 600;
 color: #3e3e3e;
 display: flex;
 justify-content: space-between;
 align-items: center;
`;

export const CardTitle = styled.div`
 display: flex;
 align-items: center;
 gap: 8px;
 font-size: 16px;
`;

export const CardTitleIcon = styled.span`
 color: #ea1d2c;
 font-family: 'Material Icons Round';
 font-size: 20px;
`;

export const CardContent = styled.div`
 padding: 16px 20px;
`;

export const DataTable = styled.table`
 width: 100%;
 border-collapse: collapse;

 th, td {
   padding: 12px 16px;
   text-align: left;
   border-bottom: 1px solid #f1f1f1;
 }

 th {
   color: #a6a6a6;
   font-weight: 600;
   font-size: 13px;
   text-transform: uppercase;
   letter-spacing: 0.5px;
 }

 td {
   font-size: 14px;
 }

 tr:last-child td {
   border-bottom: none;
 }

 tr:hover {
   background-color: #f2f2f2;
 }

 @media (max-width: 768px) {
   th, td {
     padding: 12px 8px;
     font-size: 12px;
   }
 }
`;

export const RestaurantName = styled.div`
 font-weight: 500;
 display: flex;
 align-items: center;
 gap: 8px;
`;

export const RestaurantLogo = styled.div`
 width: 32px;
 height: 32px;
 border-radius: 50%;
 background-color: #f1f1f1;
 display: flex;
 align-items: center;
 justify-content: center;
 color: #3e3e3e;
 font-weight: 600;
 font-size: 12px;
 overflow: hidden;

 img {
   width: 100%;
   height: 100%;
   object-fit: cover;
 }

 @media (max-width: 768px) {
   width: 28px;
   height: 28px;
 }
`;

export const Highlight = styled.span`
 color: #ea1d2c;
 font-weight: 600;
`;

export const DeliveryTime = styled.div`
 display: flex;
 align-items: center;
 gap: 4px;
`;

export const DeliveryTimeIcon = styled.span`
 color: #a6a6a6;
 font-family: 'Material Icons Round';
 font-size: 16px;
`;

export const DeliveryBadge = styled.span`
 padding: 4px 8px;
 border-radius: 4px;
 font-size: 12px;
 font-weight: 500;
 color: white;

 &.success {
   background-color: #50b773;
 }

 &.warning {
   background-color: #ffba00;
 }

 &.danger {
   background-color: #ea1d2c;
 }

 &.neutral {
   background-color: #a6a6a6;
 }
`;

export const ProgressBar = styled.div`
 height: 6px;
 width: 100%;
 background-color: #f1f1f1;
 border-radius: 3px;
 overflow: hidden;
 margin-top: 8px;
`;

export const ProgressFill = styled.div`
 height: 100%;
 width: ${props => props.width}%;
 background-color: #50b773;
 border-radius: 3px;
 transition: width 0.3s ease;

 &.success {
   background-color: #50b773;
 }

 &.warning {
   background-color: #ffba00;
 }

 &.danger {
   background-color: #ea1d2c;
 }
`;

export const ChartContainer = styled.div`
 position: relative;
 height: 300px;
 margin-top: 20px;
`;

export const LoadingIndicator = styled.div`
 text-align: center;
 padding: 40px;
 color: #a6a6a6;
 display: flex;
 flex-direction: column;
 align-items: center;
 gap: 16px;
`;

export const LoadingSpinner = styled.div`
 width: 40px;
 height: 40px;
 border: 3px solid rgba(234, 29, 44, 0.1);
 border-top: 3px solid #ea1d2c;
 border-radius: 50%;
 animation: spin 1s linear infinite;

 @keyframes spin {
   0% {
     transform: rotate(0deg);
   }
   100% {
     transform: rotate(360deg);
   }
 }
`;

export const PerformanceCard = styled.div`
 display: flex;
 align-items: center;
 gap: 12px;
 padding: 12px 0;
 border-bottom: 1px solid #f1f1f1;

 &:last-child {
   border-bottom: none;
 }
`;

export const PerformanceIcon = styled.span`
 font-family: 'Material Icons Round';
 padding: 8px;
 border-radius: 50%;

 &.success {
   color: #50b773;
   background-color: rgba(80, 183, 115, 0.1);
 }

 &.warning {
   color: #ffba00;
   background-color: rgba(255, 186, 0, 0.1);
 }

 &.danger {
   color: #ea1d2c;
   background-color: rgba(234, 29, 44, 0.1);
 }
`;

export const PerformanceContent = styled.div`
 flex: 1;
`;

export const PerformanceTitle = styled.h4`
 margin-bottom: 4px;
 font-size: 14px;
 font-weight: 600;
 color: #3e3e3e;
`;

export const PerformanceText = styled.p`
 color: #a6a6a6;
 font-size: 13px;
 line-height: 1.5;
`;