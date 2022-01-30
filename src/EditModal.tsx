/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { prodErrorMap } from 'firebase/auth'
import { Note } from './models/note'

export default function EditModal(props: {open: boolean; note?: Note; typeEditNoteFn: any, editModalOpenFn: any; confirmUpdateFn: any}) {

  const cancelButtonRef = useRef(null)
  const titleRef = useRef(null)
  const contentRef = useRef(null)


  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={() => props.editModalOpenFn(false)}>
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            {props.note ?
            <div className="pt-2 inline-block align-top bg-slate-700 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <h1 className='m-4 text-slate-50 font-mono text-md'>Edit</h1>
              <div className="px-4 pb-4 sm:p-6 sm:pb-4">
                <div>
                <div>
                    <input className="p-4 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md bg-slate-900 shadow-md bg-opacity-70 text-stone-50"
                        ref={titleRef}
                        type="text"
                        name="title"
                        value={props.note.title}
                        onChange={props.typeEditNoteFn}
                        placeholder="Title..."
                    />
                </div>
                <div className="textarea-container">
                    <textarea className="p-4 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md bg-slate-900 shadow-md bg-opacity-70 text-stone-50"
                            ref={contentRef}
                            rows={5}
                            name="content"
                            placeholder="Content..."
                            value={props.note.content}
                            onChange={props.typeEditNoteFn}
                        >
                    </textarea>
                </div>
                </div>
              </div>
              <div className="bg-slate-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-tl from-fuchsia-600  to-violet-800 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => props.confirmUpdateFn()}
                >
                  Update
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => props.editModalOpenFn(false)}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
              </div>
            </div>
            :
            ""}
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

