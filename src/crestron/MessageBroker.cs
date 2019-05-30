using Newtonsoft.Json;

namespace SSharpHomebridge
{
    public class Message
    {
        public ushort DeviceId;
        public string DeviceType;
        public string MessageType;
        public string Operation;
        public string Property;
        public ushort Value;
    }

    public class MessageBroker
    {
        public delegate void MessageHandler(Message message);

        public static event MessageHandler OnLightSwitchMessage;
        public static event MessageHandler OnLightDimmerMessage;
        public static event MessageHandler OnSwitchMessage;
        public static event MessageHandler OnWidowCoveringMessage;
        public static event MessageHandler OnHeaterCoolerMessage;
        public static event MessageHandler OnFanMessage;
        public static event MessageHandler OnSensorStateMessage;
        /// <summary>
        /// SIMPL+ can only execute the default constructor. If you have variables that require initialization, please
        /// use an Initialize method
        /// </summary>
        public MessageBroker()
        {
        }

        public static void TriggerLightSwitchMessage(Message message)
        {
            OnLightSwitchMessage(message);
        }

        public static void TriggerLightDimmerMessage(Message message)
        {
            OnLightDimmerMessage(message);
        }

        public static void TriggerSwitchMessage(Message message)
        {
            OnSwitchMessage(message);
        }

        public static void TriggerFanMessage(Message message)
        {
            OnFanMessage(message);
        }

        public static void TriggerSensorStateMessage(Message message)
        {
            OnSensorStateMessage(message);
        }

        public static void TriggerWindowCoveringMessage(Message message)
        {
            OnWindowCoveringMessage(message);
        }

        public static void TriggerHeaterCoolerMessage(Message message)
        {
            OnHeaterCoolerMessage(message);
        }

        public static void ParseMessage(string messageJson)
        {
            var message = JsonConvert.DeserializeObject<Message>(messageJson);

            switch (message.DeviceType)
            {
                case "LightSwitch":
                    TriggerLightSwitchMessage(message);
                    break;

                case "LightDimmer":
                    TriggerLightDimmerMessage(message);
                    break;

                case "Switch":
                    TriggerSwitchMessage(message);
                    break;

                case "Fan":
                    TriggerFanMessage(message);
                    break;

                case "WindowCovering":
                    TriggerWindowCoveringMessage(message);
                    break;

                case "HeaterCooler":
                    TriggerHeaterCoolerMessage(message);
                    break;

                case "OccupancySensor":
                    TriggerSensorStateMessage(message);
                    break;

                case "SmokeSensor":
                    TriggerSensorStateMessage(message);
                    break;

                case "LeakSensor":
                    TriggerSensorStateMessage(message);
                    break;

                case "MotionSensor":
                    TriggerSensorStateMessage(message);
                    break;

                case "ContactSensor":
                    TriggerSensorStateMessage(message);
                    break;

                case "CarbonMonoxideSensor":
                    TriggerSensorStateMessage(message);
                    break;

                case "CarbonDioxideSensor":
                    TriggerSensorStateMessage(message);
                    break;
            }
        }

        public static string SerializeMessage(Message message)
        {
            return JsonConvert.SerializeObject(message);
        }
    }
}
