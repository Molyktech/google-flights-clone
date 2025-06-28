"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { ChevronLeft, ChevronRight, CalendarToday, NavigateBefore, NavigateNext } from "@mui/icons-material";

interface DatePickerProps {
  open: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  selectedReturnDate: Date | null;
  onDateSelect: (date: Date, returnDate?: Date) => void;
  tripType: string;
  onTripTypeChange: (type: string) => void;
}

interface DatePrice {
  date: number;
  price: string;
  isSelected?: boolean;
  isReturnSelected?: boolean;
  isInRange?: boolean;
  isDisabled?: boolean;
  isPast?: boolean;
}

const FlightDatePicker: React.FC<DatePickerProps> = ({
  open,
  onClose,
  selectedDate,
  selectedReturnDate,
  onDateSelect,
  tripType,
  onTripTypeChange,
}) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth()));
  const [departureDate, setDepartureDate] = useState<Date | null>(selectedDate);
  const [returnDate, setReturnDate] = useState<Date | null>(selectedReturnDate);
  const [selectingReturn, setSelectingReturn] = useState(false);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["M", "T", "W", "T", "F", "S", "S"];

  // Reset return date when switching to one-way
  useEffect(() => {
    if (tripType === "one-way") {
      setReturnDate(null);
      setSelectingReturn(false);
    }
  }, [tripType]);

  const getPriceForDate = (date: number, month: number): string => {
    const prices = ["₦105K", "₦110K", "₦130K", "₦95K", "₦120K"];
    return prices[(date + month) % prices.length];
  };

  const isDateInPast = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateInRange = (date: Date): boolean => {
    if (!departureDate || !returnDate || tripType === "one-way") return false;
    return date >= departureDate && date <= returnDate;
  };

  const generateCalendarDays = (month: Date): DatePrice[] => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
    // Convert to Monday = 0 format
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7;

    const days: DatePrice[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ date: 0, price: "", isDisabled: true });
    }

    // Add all days of the month
    for (let date = 1; date <= daysInMonth; date++) {
      const currentDate = new Date(year, monthIndex, date);
      const isPast = isDateInPast(currentDate);

      const isSelected = departureDate && currentDate.getTime() === departureDate.getTime();

      const isReturnSelected = returnDate && currentDate.getTime() === returnDate.getTime();

      const isInRange = isDateInRange(currentDate);

      days.push({
        date,
        price: isPast ? "" : getPriceForDate(date, monthIndex),
        isSelected,
        isReturnSelected,
        isInRange,
        isDisabled: isPast,
        isPast,
      });
    }

    return days;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === "prev") {
        // Don't go to past months
        const prevMonth = new Date(prev.getFullYear(), prev.getMonth() - 1);
        if (
          prevMonth.getFullYear() < today.getFullYear() ||
          (prevMonth.getFullYear() === today.getFullYear() && prevMonth.getMonth() < today.getMonth())
        ) {
          return prev;
        }
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const handleDateClick = (date: number, monthDate: Date) => {
    if (date === 0) return;

    const selectedDateObj = new Date(monthDate.getFullYear(), monthDate.getMonth(), date);

    if (isDateInPast(selectedDateObj)) return;

    if (tripType === "one-way") {
      setDepartureDate(selectedDateObj);
      setReturnDate(null);
    } else {
      // Round trip logic
      if (!departureDate || selectingReturn) {
        if (!departureDate) {
          setDepartureDate(selectedDateObj);
          setSelectingReturn(true);
        } else {
          if (selectedDateObj >= departureDate) {
            setReturnDate(selectedDateObj);
            setSelectingReturn(false);
          } else {
            // If selected date is before departure, make it the new departure
            setDepartureDate(selectedDateObj);
            setReturnDate(null);
            setSelectingReturn(true);
          }
        }
      } else {
        // If both dates are selected, start over
        setDepartureDate(selectedDateObj);
        setReturnDate(null);
        setSelectingReturn(true);
      }
    }
  };

  const handleReset = () => {
    setDepartureDate(null);
    setReturnDate(null);
    setSelectingReturn(false);
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth()));
  };

  const handleDone = () => {
    if (departureDate) {
      onDateSelect(departureDate, returnDate || undefined);
      onClose();
    }
  };

  const formatSelectedDate = (date: Date | null) => {
    if (!date) return "";
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
  };

  const getDateRangeText = () => {
    if (tripType === "one-way") {
      return departureDate ? formatSelectedDate(departureDate) : "";
    } else {
      if (departureDate && returnDate) {
        return `${formatSelectedDate(departureDate)} - ${formatSelectedDate(returnDate)}`;
      } else if (departureDate) {
        return `${formatSelectedDate(departureDate)} - Return date`;
      } else {
        return "Select dates";
      }
    }
  };

  const currentMonthDays = generateCalendarDays(currentMonth);
  const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
  const nextMonthDays = generateCalendarDays(nextMonth);

  const lowestPrice = "₦130,100";

  // Check if we can go to previous month
  const canGoPrevious =
    currentMonth.getFullYear() > today.getFullYear() ||
    (currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() > today.getMonth());

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <FormControl size="small">
                <Select
                  value={tripType}
                  onChange={(e) => onTripTypeChange(e.target.value)}
                  sx={{
                    "& .MuiSelect-select": {
                      py: 1,
                      fontSize: "0.875rem",
                    },
                  }}>
                  <MenuItem value="one-way">One-way</MenuItem>
                  <MenuItem value="round-trip">Round trip</MenuItem>
                  <MenuItem value="multi-city">Multi-city</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="text"
                onClick={handleReset}
                sx={{
                  color: "primary.main",
                  textTransform: "none",
                  fontWeight: 500,
                }}>
                Reset
              </Button>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "8px",
                px: 2,
                py: 1,
                minWidth: 200,
              }}>
              <CalendarToday sx={{ mr: 1, fontSize: 20, color: "text.secondary" }} />
              <Typography variant="body1" sx={{ mr: 2, flex: 1 }}>
                {getDateRangeText()}
              </Typography>
              <IconButton size="small" onClick={() => navigateMonth("prev")} disabled={!canGoPrevious}>
                <NavigateBefore />
              </IconButton>
              <IconButton size="small" onClick={() => navigateMonth("next")}>
                <NavigateNext />
              </IconButton>
            </Box>
          </Box>

          {/* Calendar Navigation */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <IconButton onClick={() => navigateMonth("prev")} disabled={!canGoPrevious}>
              <ChevronLeft />
            </IconButton>

            <Box sx={{ display: "flex", gap: 8 }}>
              <Typography variant="h6" sx={{ fontWeight: 500, minWidth: 120, textAlign: "center" }}>
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 500, minWidth: 120, textAlign: "center" }}>
                {monthNames[nextMonth.getMonth()]} {nextMonth.getFullYear()}
              </Typography>
            </Box>

            <IconButton onClick={() => navigateMonth("next")}>
              <ChevronRight />
            </IconButton>
          </Box>

          {/* Calendar Grid */}
          <Box sx={{ display: "flex", gap: 4 }}>
            {/* Current Month */}
            <Box sx={{ flex: 1 }}>
              {/* Day Headers */}
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1, mb: 1 }}>
                {dayNames.map((day) => (
                  <Box key={day} sx={{ textAlign: "center", py: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {day}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Calendar Days */}
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}>
                {currentMonthDays.map((day, index) => (
                  <Box key={index} sx={{ textAlign: "center" }}>
                    {day.date > 0 ? (
                      <Box
                        onClick={() => handleDateClick(day.date, currentMonth)}
                        sx={{
                          cursor: day.isDisabled ? "not-allowed" : "pointer",
                          p: 1,
                          borderRadius: "8px",
                          bgcolor:
                            day.isSelected || day.isReturnSelected
                              ? "primary.main"
                              : day.isInRange
                                ? "primary.light"
                                : "transparent",
                          color:
                            day.isSelected || day.isReturnSelected
                              ? "white"
                              : day.isDisabled
                                ? "text.disabled"
                                : "text.primary",
                          opacity: day.isDisabled ? 0.5 : 1,
                          "&:hover": {
                            bgcolor: day.isDisabled
                              ? "transparent"
                              : day.isSelected || day.isReturnSelected
                                ? "primary.dark"
                                : "action.hover",
                          },
                        }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: day.isSelected || day.isReturnSelected ? 600 : 400 }}>
                          {day.date}
                        </Typography>
                        {!day.isDisabled && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: day.isSelected || day.isReturnSelected ? "white" : "success.main",
                              fontWeight: 500,
                              fontSize: "0.7rem",
                            }}>
                            {day.price}
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Box sx={{ p: 1, height: "60px" }} />
                    )}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Next Month */}
            <Box sx={{ flex: 1 }}>
              {/* Day Headers */}
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1, mb: 1 }}>
                {dayNames.map((day) => (
                  <Box key={day} sx={{ textAlign: "center", py: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {day}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Calendar Days */}
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}>
                {nextMonthDays.map((day, index) => (
                  <Box key={index} sx={{ textAlign: "center" }}>
                    {day.date > 0 ? (
                      <Box
                        onClick={() => handleDateClick(day.date, nextMonth)}
                        sx={{
                          cursor: day.isDisabled ? "not-allowed" : "pointer",
                          p: 1,
                          borderRadius: "8px",
                          bgcolor:
                            day.isSelected || day.isReturnSelected
                              ? "primary.main"
                              : day.isInRange
                                ? "primary.light"
                                : "transparent",
                          color:
                            day.isSelected || day.isReturnSelected
                              ? "white"
                              : day.isDisabled
                                ? "text.disabled"
                                : "text.primary",
                          opacity: day.isDisabled ? 0.5 : 1,
                          "&:hover": {
                            bgcolor: day.isDisabled
                              ? "transparent"
                              : day.isSelected || day.isReturnSelected
                                ? "primary.dark"
                                : "action.hover",
                          },
                        }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: day.isSelected || day.isReturnSelected ? 600 : 400 }}>
                          {day.date}
                        </Typography>
                        {!day.isDisabled && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: day.isSelected || day.isReturnSelected ? "white" : "success.main",
                              fontWeight: 500,
                              fontSize: "0.7rem",
                            }}>
                            {day.price}
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Box sx={{ p: 1, height: "60px" }} />
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Footer */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4, pt: 3 }}>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                from {lowestPrice}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {tripType} price
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={handleDone}
              disabled={!departureDate || (tripType === "round-trip" && !returnDate)}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: "24px",
                textTransform: "none",
                fontWeight: 500,
              }}>
              Done
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default FlightDatePicker;
