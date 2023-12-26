<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { useFixedScheduleStore } from "../../stores/FixedScheduleStore";
import { useChangeDateFormat } from "../../reuse/useChangeDateFormat";

import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import viLocale from "@fullcalendar/core/locales/vi";

const { formatDateFromInstantToTime, formatInstantFromJavascriptTime } =
  useChangeDateFormat();
const props = defineProps({
  immunizationUnitId: {
    type: String,
    required: true,
  },
  vaccinationType: {
    type: String,
    required: false,
  },
});
const fullCalendar = ref(null);
const fixedScheduleStore = useFixedScheduleStore();
const selectedDateRange = ref({
  fromDate: null,
  toDate: null,
});
const calendarOptions = reactive({
  events: [],
  plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
  firstDay: 1,
  editable: false,
  droppable: true,
  headerToolbar: {
    left: "title",
    right: "prev,next today dayGridMonth,timeGridWeek,timeGridDay,listWeek",
  },
  locale: viLocale,
  dateClick: function (info) {
    console.log(info);
  },
  eventClick: function (info) {
    const event = info.event;
    console.log("Sự kiện được nhấp vào:", event.extendedProps.fixedScheduleId);
    console.log(info);
  },

  datesSet: function (info) {
    console.log(info);
    console.log(formatInstantFromJavascriptTime(info.end));
    getDateRange(info.start, info.end);
  },
});

const getDateRange = (infoStart, infoEnd) => {
  selectedDateRange.value.fromDate = formatInstantFromJavascriptTime(infoStart);
  selectedDateRange.value.toDate = formatInstantFromJavascriptTime(infoEnd);

  refreshEvents();
};

const workingCalendar = ref([]);

const getWorkingCalendar = async (
  vaccinationType,
  immunizationUnitId,
  isEnable,
  fromDate,
  toDate
) => {
  try {
    workingCalendar.value = await fixedScheduleStore.findWorkingScheduleByRange(
      vaccinationType,
      immunizationUnitId,
      isEnable,
      fromDate,
      toDate
    );
    // console.log(workingCalendar.value);
  } catch (error) {
    console.log(error);
  }
};

const refreshEvents = () => {
  getWorkingCalendar(
    props.vaccinationType,
    props.immunizationUnitId,
    1,
    selectedDateRange.value.fromDate,
    selectedDateRange.value.toDate
  );
};

watch(
  () => workingCalendar.value,
  (newVal) => {
    calendarOptions.events = [];
    if (newVal) {
      newVal.forEach((getWorkingSchedule) => {
        var startTime = formatDateFromInstantToTime(
          getWorkingSchedule.startTime
        );
        var endTime = formatDateFromInstantToTime(getWorkingSchedule.endTime);

        var [startHour, startMinute] = startTime.split(":");
        var [endHour, endMinute] = endTime.split(":");

        var calendarOption = {
          title: getWorkingSchedule.title,
          start: new Date(getWorkingSchedule.date).setHours(
            startHour,
            startMinute
          ),
          end: new Date(getWorkingSchedule.date).setHours(endHour, endMinute),

          color: "#3c90df",
          description: "hello",
          fixedScheduleId: 1,
        };
        calendarOptions.events.push(calendarOption);
      });
      console.log(calendarOptions.events);
    }
  }
);

defineExpose({
  refreshEvents,
});

onMounted(() => {});
</script>

<style lang="scss">
@import "@/assets/scss/vendor/fullcalendar";
</style>

<template>
  <div class="row items-push">
    <div class="col-md-12">
      <FullCalendar
        ref="fullCalendar"
        :options="calendarOptions"
        defaultView="dayGridMonth"
        @datesRender="console.log('yeah')"
      ></FullCalendar>
    </div>
  </div>
</template>
