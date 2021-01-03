import {GetterTree, MutationTree, ActionTree, Module as BaseModule} from 'vuex'
import {RootState} from '@/store/types'
import {User} from "@/store/modules/user/types"

export interface State {
  chat: Chat | null;
  chats: Chat[];
}

export interface Chat {
  id: number;
  title: string;
  created: string;
  users: User[];
  messages: string[];
}

export type Getter = GetterTree<State, RootState>
export type Mutation = MutationTree<State>
export type Action = ActionTree<State, RootState>
export type Module = BaseModule<State, RootState>