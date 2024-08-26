import { FC } from "react"
import {
  Datagrid,
  List,
  Edit,
  SimpleForm,
  Create,
  TopToolbar,
  ListButton,
  TextField,
  Resource,
  TextInput,
  ReferenceArrayInput,
  DateTimeInput,
  Show,
  SimpleShowLayout,
  useRecordContext,
  ReferenceArrayField,
  EditButton,
  FieldProps,
} from "react-admin"

const VoteUrlField: FC<FieldProps> = props => {
  const record = useRecordContext(props)

  return (
    <span>
      {window.location.origin}/vote/{record.id}
    </span>
  )
}

export const Sessions = () => (
  <List title={"Сеансы"}>
    <Datagrid rowClick="show">
      <TextField source="name" label="Название" />
      <TextField source="start" label="Начало" />
      <TextField source="end" label="Окончание" />

      <EditButton />
    </Datagrid>
  </List>
)

const SessionPostActions = (
  <TopToolbar>
    <ListButton />
  </TopToolbar>
)

export const SessionEdit = () => (
  <Edit actions={SessionPostActions}>
    <SimpleForm>
      <TextInput source="name" label="Название" />
      <DateTimeInput source="start" label="Начало" />
      <DateTimeInput source="end" label="Окончание" />
      <ReferenceArrayInput source="films" reference="film" />
    </SimpleForm>
  </Edit>
)

export const SessionCreate = () => {
  return (
    <Create
      actions={SessionPostActions}
      redirect={"list"}
      title={"Создание сеанса"}
    >
      <SimpleForm>
        <TextInput source="name" label="Название" />
        <DateTimeInput source="start" label="Начало" />
        <DateTimeInput source="end" label="Окончание" />
        <ReferenceArrayInput source="films" reference="film" />
      </SimpleForm>
    </Create>
  )
}

const ShowLayout = () => (
  <SimpleShowLayout>
    <TextField source="name" label="Название" />
    <TextField source="start" label="Начало" />
    <TextField source="end" label="Окончание" />
    <ReferenceArrayField source="films" reference="film" />
    <VoteUrlField label="Ссылка на голосование" />
  </SimpleShowLayout>
)

export const SessionReportShow = () => (
  <Show actions={SessionPostActions}>
    <ShowLayout />
  </Show>
)

export const sessionResource = (
  <Resource
    name={"session"}
    list={Sessions}
    edit={SessionEdit}
    create={SessionCreate}
    show={SessionReportShow}
    recordRepresentation={"name"}
    options={{ label: "Сеансы" }}
  />
)
