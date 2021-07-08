import {
  Tag,
  Col,
  Row,
  Tabs,
  Main,
  Step,
  Form,
  Card,
  Radio,
  Input,
  Image,
  Badge,
  Steps,
  Table,
  Upload,
  Switch,
  Dialog,
  Select,
  Option,
  Button,
  Avatar,
  Header,
  Tooltip,
  Divider,
  Backtop,
  TabPane,
  Message,
  Cascader,
  FormItem,
  Checkbox,
  Dropdown,
  MessageBox,
  Pagination,
  DatePicker,
  Breadcrumb,
  RadioGroup,
  RadioButton,
  TableColumn,
  Autocomplete,
  Notification,
  DropdownItem,
  DropdownMenu,
  CheckboxGroup,
  BreadcrumbItem
} from "element-ui";

export default {
  install(Vue) {
    Vue.prototype.$message = Message;
    Vue.prototype.$notify = Notification;
    Vue.prototype.$alert = MessageBox.alert;
    Vue.prototype.$confirm = MessageBox.confirm;
    Vue.use(Tag);
    Vue.use(Col);
    Vue.use(Row);
    Vue.use(Tabs);
    Vue.use(Main);
    Vue.use(Card);
    Vue.use(Step);
    Vue.use(Form);
    Vue.use(Radio);
    Vue.use(Input);
    Vue.use(Badge);
    Vue.use(Steps);
    Vue.use(Image);
    Vue.use(Table);
    Vue.use(Upload);
    Vue.use(Switch);
    Vue.use(Dialog);
    Vue.use(Select);
    Vue.use(Option);
    Vue.use(Avatar);
    Vue.use(Header);
    Vue.use(Button);
    Vue.use(Tooltip);
    Vue.use(TabPane);
    Vue.use(Divider);
    Vue.use(Backtop);
    Vue.use(Cascader);
    Vue.use(Checkbox);
    Vue.use(FormItem);
    Vue.use(Dropdown);
    Vue.use(DatePicker);
    Vue.use(RadioGroup);
    Vue.use(Breadcrumb);
    Vue.use(Pagination);
    Vue.use(TableColumn);
    Vue.use(RadioButton);
    Vue.use(Autocomplete);
    Vue.use(DropdownItem);
    Vue.use(DropdownMenu);
    Vue.use(CheckboxGroup);
    Vue.use(BreadcrumbItem);
  }
};
