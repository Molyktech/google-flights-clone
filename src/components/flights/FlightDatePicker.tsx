/* eslint-disable */

import { CalendarToday, ChevronLeft, ChevronRight, KeyboardArrowDown } from "@mui/icons-material";
import {
  Box,
  Button,
  ClickAwayListener,
  Fade,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Popper,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import type React from "react";
import { useEffect, useState } from "react";
import type { DatePrice, PriceData } from "../../lib/models/flight";
import { getPriceCalendar } from "../../services/flight-api";

interface DatePickerProps {
  open: boolean;
  onClose: () => void;
  anchorEl?: HTMLElement | null;
  selectedDate: Date | null;
  selectedReturnDate: Date | null;
  onDateSelect: (date: Date, returnDate?: Date) => void;
  tripType: string;
  onTripTypeChange: (type: string) => void;
  // Make these optional for reusability
  searchParams?: {
    originSkyId?: string;
    destinationSkyId?: string;
    originEntityId?: string;
    destinationEntityId?: string;
  };
  // Allow parent to pass custom prices
  customPrices?: { [key: string]: number };
  // Control whether to show prices at all
  showPrices?: boolean;
  // Control whether to fetch prices from API
  fetchPrices?: boolean;
}

const FlightDatePicker: React.FC<DatePickerProps> = ({
  open,
  onClose,
  anchorEl,
  selectedDate,
  selectedReturnDate,
  onDateSelect,
  tripType,
  onTripTypeChange,
  searchParams,
  showPrices = true,
  fetchPrices = true,
}) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth()));
  const [departureDate, setDepartureDate] = useState<Date | null>(selectedDate);
  const [returnDate, setReturnDate] = useState<Date | null>(selectedReturnDate);
  const [selectingReturn, setSelectingReturn] = useState(false);
  const [priceData, setPriceData] = useState<PriceData>({});
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [priceLoadingFailed, setPriceLoadingFailed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasPricesLoaded, setHasPricesLoaded] = useState(false);
  const [loadedMonths, setLoadedMonths] = useState<{ [key: string]: boolean }>({});
  const theme = useTheme();

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

  // Initialize dates from props
  useEffect(() => {
    setDepartureDate(selectedDate);
    setReturnDate(selectedReturnDate);
  }, [selectedDate, selectedReturnDate]);

  // Reset return date when switching to one-way
  useEffect(() => {
    if (tripType === "oneway") {
      setReturnDate(null);
      setSelectingReturn(false);
    }
  }, [tripType]);

  // Helper to get first/last day of a month
  const getMonthRange = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return {
      fromDate: (firstDay < today ? today : firstDay).toISOString().split("T")[0],
      toDate: lastDay.toISOString().split("T")[0],
      key: `${firstDay.getFullYear()}-${firstDay.getMonth()}`,
    };
  };

  // Load prices for a given month if not already loaded
  const loadMonthPrices = async (monthDate: Date) => {
    const { fromDate, toDate, key } = getMonthRange(monthDate);
    if (loadedMonths[key]) return; // Already loaded
    setLoadingPrices(true);
    setPriceLoadingFailed(false);
    try {
      const priceCalendarData = await getPriceCalendar({
        originSkyId: searchParams?.originSkyId || "",
        destinationSkyId: searchParams?.destinationSkyId || "",
        originEntityId: searchParams?.originEntityId || "",
        destinationEntityId: searchParams?.destinationEntityId || "",
        fromDate,
        toDate,
        currency: "NGN",
      });
      const newPrices: PriceData = {};
      if (priceCalendarData?.data?.flights?.days && Array.isArray(priceCalendarData.data.flights.days)) {
        priceCalendarData.data.flights.days.forEach((dayObj: any) => {
          if (dayObj.day && typeof dayObj.price === "number") {
            newPrices[dayObj.day] = dayObj.price;
          }
        });
      }

      setPriceData((prev) => ({ ...prev, ...newPrices }));
      setLoadedMonths((prev) => ({ ...prev, [key]: true }));
      setHasPricesLoaded(true);
    } catch (error) {
      setPriceLoadingFailed(true);
    } finally {
      setLoadingPrices(false);
    }
  };

  // Effect: this will load prices for current and next month when visible or month changes
  useEffect(() => {
    if (fetchPrices && showPrices && searchParams?.originSkyId && searchParams?.destinationSkyId && open) {
      loadMonthPrices(currentMonth);
      const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
      loadMonthPrices(nextMonth);
    }
  }, [searchParams?.originSkyId, searchParams?.destinationSkyId, currentMonth, open, fetchPrices, showPrices]);

  // Reset loaded months and prices when search params change
  useEffect(() => {
    setPriceData({});
    setLoadedMonths({});
    setHasPricesLoaded(false);
  }, [searchParams?.originSkyId, searchParams?.destinationSkyId]);

  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      const thousands = price / 1000;
      return `₦${thousands.toFixed(0)}K`;
    }
    return `₦${price}`;
  };

  const getPriceForDate = (date: Date): { price: string; priceValue: number; isLowestPrice: boolean } => {
    if (!showPrices || priceLoadingFailed || !hasPricesLoaded) {
      return { price: "", priceValue: 0, isLowestPrice: false };
    }

    const dateStr = date.toISOString().split("T")[0];
    const priceValue = priceData[dateStr] || 0;

    if (priceValue === 0) return { price: "", priceValue: 0, isLowestPrice: false };

    // Calculate if this is one of the lowest prices
    const allPrices = Object.values(priceData).filter((p) => p > 0);
    const sortedPrices = allPrices.sort((a, b) => a - b);
    const lowestThreshold = sortedPrices[Math.floor(sortedPrices.length * 0.3)] || 0;

    return {
      price: formatPrice(priceValue),
      priceValue,
      isLowestPrice: priceValue <= lowestThreshold,
    };
  };

  const isDateInPast = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateInRange = (date: Date): boolean => {
    if (!departureDate || !returnDate || tripType === "oneway") return false;
    return date >= departureDate && date <= returnDate;
  };

  const generateCalendarDays = (month: Date): DatePrice[] => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const daysInMonth = lastDay.getDate();

    const firstDayOfWeek = (firstDay.getDay() + 6) % 7;

    const days: DatePrice[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ date: 0, price: "", priceValue: 0, isDisabled: true });
    }

    // Add all days of the month
    for (let date = 1; date <= daysInMonth; date++) {
      const currentDate = new Date(year, monthIndex, date);
      const isPast = isDateInPast(currentDate);
      const { price, priceValue, isLowestPrice } = getPriceForDate(currentDate);

      const isSelected = !!(departureDate && currentDate.getTime() === departureDate.getTime());
      const isReturnSelected = !!(returnDate && currentDate.getTime() === returnDate.getTime());
      const isInRange = !!isDateInRange(currentDate);

      days.push({
        date,
        price: isPast ? "" : price,
        priceValue,
        isSelected,
        isReturnSelected,
        isInRange,
        isDisabled: isPast,
        isPast,
        isLowestPrice,
      });
    }

    return days;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    // Save scroll position
    const prevScrollY = window.scrollY;

    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === "prev") {
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

    // Restore scroll position after DOM update
    setTimeout(() => {
      window.scrollTo({ top: prevScrollY, behavior: "smooth" });
    }, 0);
  };

  const handleDateClick = (date: number, monthDate: Date) => {
    if (date === 0) return;

    const selectedDateObj = new Date(monthDate.getFullYear(), monthDate.getMonth(), date);

    if (isDateInPast(selectedDateObj)) return;

    if (tripType === "oneway") {
      setDepartureDate(selectedDateObj);
      setReturnDate(null);
    } else {
      if (!departureDate || selectingReturn) {
        if (!departureDate) {
          setDepartureDate(selectedDateObj);
          setSelectingReturn(true);
        } else {
          if (selectedDateObj >= departureDate) {
            setReturnDate(selectedDateObj);
            setSelectingReturn(false);
          } else {
            setDepartureDate(selectedDateObj);
            setReturnDate(null);
            setSelectingReturn(true);
          }
        }
      } else {
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

  const handleCancel = () => {
    setDepartureDate(selectedDate);
    setReturnDate(selectedReturnDate);
    setSelectingReturn(false);
    onClose();
  };

  const handleDone = () => {
    if (departureDate) {
      onDateSelect(departureDate, returnDate || undefined);
    }
    onClose();
  };

  const formatSelectedDate = (date: Date | null) => {
    if (!date) return "";
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
  };

  const getDateRangeText = () => {
    if (tripType === "oneway") {
      return departureDate ? formatSelectedDate(departureDate) : "Select date";
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

  const canGoPrevious =
    currentMonth.getFullYear() > today.getFullYear() ||
    (currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() > today.getMonth());

  const handleTripTypeChangeInternal = (newTripType: string) => {
    onTripTypeChange(newTripType);
    setDropdownOpen(false);
  };

  const handleClickAway = (event: Event) => {
    if (dropdownOpen) return;

    const target = event.target as HTMLElement;
    if (
      target.closest(".MuiMenu-root") ||
      target.closest(".MuiSelect-root") ||
      target.closest('[role="listbox"]') ||
      target.closest('[role="option"]') ||
      target.closest(".MuiMenuItem-root") ||
      target.closest(".MuiPopover-root")
    ) {
      return;
    }

    onClose();
  };

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-start"
      transition
      style={{ zIndex: 1300 }}
      modifiers={[
        {
          name: "flip",
          enabled: false, // disables flipping
        },
        {
          name: "offset",
          options: {
            offset: [0, 8],
          },
        },
      ]}>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={200}>
          <Paper
            elevation={8}
            sx={{
              bgcolor: theme.palette.background.paper,
              border: "1px solid",
              borderColor: theme.palette.divider,
              borderRadius: "12px",
              width: "100%",
              minWidth: 320,
            }}>
            <ClickAwayListener onClickAway={handleClickAway}>
              <Box sx={{ p: "16px 8px 8px" }}>
                {/* Header */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: { xs: "wrap", sm: "nowrap" },
                    gap: 2,
                  }}>
                  {/* Trip Type Dropdown */}
                  <FormControl size="small">
                    <Select
                      value={tripType}
                      onChange={(e) => handleTripTypeChangeInternal(e.target.value)}
                      onOpen={() => setDropdownOpen(true)}
                      onClose={() => setDropdownOpen(false)}
                      IconComponent={KeyboardArrowDown}
                      sx={{
                        "& .MuiSelect-select": {
                          py: 1,
                          px: 2,
                          fontSize: "0.875rem",
                          fontWeight: 500,
                        },
                        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                        "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
                      }}
                      MenuProps={{
                        disablePortal: false,
                        PaperProps: {
                          sx: { zIndex: 1500 },
                          onMouseDown: (e: React.MouseEvent) => e.stopPropagation(),
                          onClick: (e: React.MouseEvent) => e.stopPropagation(),
                        },
                        MenuListProps: {
                          onMouseDown: (e: React.MouseEvent) => e.stopPropagation(),
                          onClick: (e: React.MouseEvent) => e.stopPropagation(),
                        },
                      }}>
                      <MenuItem value="oneway">One-way</MenuItem>
                      <MenuItem value="round">Round trip</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Reset Button */}
                  <Button
                    variant="text"
                    onClick={handleReset}
                    sx={{
                      color: theme.palette.primary.main,
                      textTransform: "none",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
                    }}>
                    Reset
                  </Button>

                  {/* Date Input */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid",
                      borderColor: theme.palette.divider,
                      borderRadius: "8px",
                      px: 2,
                      py: 1.5,
                      minWidth: { xs: "100%", sm: "240px" },
                      bgcolor: theme.palette.background.default,
                    }}>
                    <CalendarToday sx={{ mr: 1.5, fontSize: 20, color: theme.palette.text.secondary }} />
                    <Typography variant="body1" sx={{ flex: 1, fontWeight: 500, fontSize: "0.875rem" }}>
                      {getDateRangeText()}
                    </Typography>
                  </Box>
                </Box>

                {/* Calendar with Navigation */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: { xs: 1, sm: 2 },
                    minHeight: { xs: 480, sm: 480 }, // Ensures stable height for 6 weeks
                    height: { xs: 480, sm: 480 },
                    width: "100%",
                    overflow: "visible",
                  }}>
                  {/* Left Chevron */}
                  <IconButton
                    onClick={() => navigateMonth("prev")}
                    disabled={!canGoPrevious}
                    sx={{
                      bgcolor: theme.palette.background.paper,
                      border: "1px solid",
                      borderColor: theme.palette.divider,
                      width: { xs: 32, sm: 40 },
                      height: { xs: 32, sm: 40 },
                      "&:hover": { bgcolor: theme.palette.action.hover },
                      "&:disabled": { opacity: 0.3 },
                    }}>
                    <ChevronLeft sx={{ fontSize: { xs: 18, sm: 24 } }} />
                  </IconButton>

                  {/* Calendar Grid */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: { xs: 2, sm: 3 },
                      flexDirection: { xs: "column", sm: "row" },
                      flex: 1,
                    }}>
                    {/* Current Month */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 500,
                          textAlign: "center",
                          mb: 2,
                          fontSize: { xs: "1rem", sm: "1.25rem" },
                        }}>
                        {monthNames[currentMonth.getMonth()]}
                      </Typography>
                      {/* Day Headers */}
                      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0.5, mb: 1 }}>
                        {dayNames.map((day, index) => (
                          <Box key={day + index} sx={{ textAlign: "center", py: 0.5 }}>
                            <Typography
                              variant="caption"
                              color={theme.palette.text.secondary}
                              sx={{
                                fontWeight: 500,
                                fontSize: { xs: "0.7rem", sm: "0.75rem" },
                              }}>
                              {day}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                      {/* Calendar Days */}
                      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0.5, minWidth: 320 }}>
                        {currentMonthDays.map((day, index) => (
                          <Box key={index} sx={{ textAlign: "center" }}>
                            {day.date > 0 ? (
                              <Box
                                onClick={() => handleDateClick(day.date, currentMonth)}
                                sx={{
                                  cursor: day.isDisabled ? "not-allowed" : "pointer",
                                  p: { xs: 0.5, sm: 1 },
                                  borderRadius: "6px",

                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  bgcolor:
                                    day.isSelected || day.isReturnSelected
                                      ? theme.palette.primary.main
                                      : day.isInRange
                                        ? theme.palette.primary.light
                                        : "transparent",
                                  color:
                                    day.isSelected || day.isReturnSelected
                                      ? "white"
                                      : day.isDisabled
                                        ? theme.palette.text.disabled
                                        : theme.palette.text.primary,
                                  opacity: day.isDisabled ? 0.5 : 1,
                                  "&:hover": {
                                    bgcolor: day.isDisabled
                                      ? "transparent"
                                      : day.isSelected || day.isReturnSelected
                                        ? theme.palette.primary.dark
                                        : theme.palette.action.hover,
                                  },
                                }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: day.isSelected || day.isReturnSelected ? 600 : 400,
                                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                                    mb: day.price ? 0.25 : 0,
                                  }}>
                                  {day.date}
                                </Typography>
                                {!day.isDisabled && day.price && showPrices && (
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color:
                                        day.isSelected || day.isReturnSelected
                                          ? "white"
                                          : day.isLowestPrice
                                            ? theme.palette.success.main
                                            : theme.palette.text.secondary,
                                      fontWeight: day.isLowestPrice ? 600 : 400,
                                      fontSize: { xs: "0.6rem", sm: "0.7rem" },
                                      lineHeight: 1,
                                      filter: loadingPrices ? "blur(1px)" : "none",
                                      opacity: loadingPrices ? 0.7 : 1,
                                      transition: "all 0.5s ease",
                                    }}>
                                    {day.price}
                                  </Typography>
                                )}
                              </Box>
                            ) : (
                              <Box sx={{ p: { xs: 0.5, sm: 1 } }} />
                            )}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                    {/* Next Month */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 500,
                          textAlign: "center",
                          mb: 2,
                          fontSize: { xs: "1rem", sm: "1.25rem" },
                        }}>
                        {monthNames[nextMonth.getMonth()]}
                      </Typography>
                      {/* Day Headers */}
                      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0.5, mb: 1 }}>
                        {dayNames.map((day, index) => (
                          <Box key={day + index} sx={{ textAlign: "center", py: 0.5 }}>
                            <Typography
                              variant="caption"
                              color={theme.palette.text.secondary}
                              sx={{
                                fontWeight: 500,
                                fontSize: { xs: "0.7rem", sm: "0.75rem" },
                              }}>
                              {day}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                      {/* Calendar Days */}
                      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0.5 }}>
                        {nextMonthDays.map((day, index) => (
                          <Box key={index} sx={{ textAlign: "center" }}>
                            {day.date > 0 ? (
                              <Box
                                onClick={() => handleDateClick(day.date, nextMonth)}
                                sx={{
                                  cursor: day.isDisabled ? "not-allowed" : "pointer",
                                  p: { xs: 0.5, sm: 1 },
                                  borderRadius: "6px",

                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  bgcolor:
                                    day.isSelected || day.isReturnSelected
                                      ? theme.palette.primary.main
                                      : day.isInRange
                                        ? theme.palette.primary.light
                                        : "transparent",
                                  color:
                                    day.isSelected || day.isReturnSelected
                                      ? "white"
                                      : day.isDisabled
                                        ? theme.palette.text.disabled
                                        : theme.palette.text.primary,
                                  opacity: day.isDisabled ? 0.5 : 1,
                                  "&:hover": {
                                    bgcolor: day.isDisabled
                                      ? "transparent"
                                      : day.isSelected || day.isReturnSelected
                                        ? theme.palette.primary.dark
                                        : theme.palette.action.hover,
                                  },
                                }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: day.isSelected || day.isReturnSelected ? 600 : 400,
                                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                                    mb: day.price ? 0.25 : 0,
                                  }}>
                                  {day.date}
                                </Typography>
                                {!day.isDisabled && day.price && showPrices && (
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color:
                                        day.isSelected || day.isReturnSelected
                                          ? "white"
                                          : day.isLowestPrice
                                            ? theme.palette.success.main
                                            : theme.palette.text.secondary,
                                      fontWeight: day.isLowestPrice ? 600 : 400,
                                      fontSize: { xs: "0.6rem", sm: "0.7rem" },
                                      lineHeight: 1,
                                      filter: loadingPrices ? "blur(1px)" : "none",
                                      opacity: loadingPrices ? 0.7 : 1,
                                      transition: "all 0.5s ease",
                                    }}>
                                    {day.price}
                                  </Typography>
                                )}
                              </Box>
                            ) : (
                              <Box sx={{ p: { xs: 0.5, sm: 1 } }} />
                            )}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                  {/* Right Chevron */}
                  <IconButton
                    onClick={() => navigateMonth("next")}
                    sx={{
                      bgcolor: theme.palette.background.paper,
                      border: "1px solid",
                      borderColor: theme.palette.divider,
                      width: { xs: 32, sm: 40 },
                      height: { xs: 32, sm: 40 },
                      "&:hover": { bgcolor: theme.palette.action.hover },
                    }}>
                    <ChevronRight sx={{ fontSize: { xs: 18, sm: 24 } }} />
                  </IconButton>
                </Box>

                {/* Footer */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: 2,

                    borderTop: "1px solid",
                    borderColor: theme.palette.divider,
                  }}>
                  <Button
                    variant="text"
                    onClick={handleCancel}
                    sx={{
                      color: theme.palette.text.secondary,
                      textTransform: "none",
                      fontWeight: 500,
                      px: 3,
                      py: 1,
                    }}>
                    Cancel
                  </Button>

                  <Button
                    variant="contained"
                    onClick={handleDone}
                    disabled={!departureDate || (tripType === "round" && !returnDate)}
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
            </ClickAwayListener>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
};

export default FlightDatePicker;
