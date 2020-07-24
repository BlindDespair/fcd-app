import { Subject, Observable, merge } from 'rxjs';
import { filter, map } from 'rxjs/operators';

declare const Zone: any;

export interface TaskChange {
  taskType: any;
  tasks: any[];
  type: 'scheduling' | 'canceling' | 'invoking' | 'invoked';
  task: any;
}
export class ChangeDetectionTrackingZoneSpec {
  name = 'ChangeDetectionTrackingZone';
  microTasks: any[] = [];
  macroTasks: any[] = [];
  eventTasks: any[] = [];

  microTasks$ = new Subject<TaskChange>();
  macroTasks$ = new Subject<TaskChange>();
  eventTasks$ = new Subject<TaskChange>();
  properties: { [key: string]: any } = { ChangeDetectionTrackingZone: this };
  timer = performance ? performance.now.bind(performance) : Date.now.bind(Date);
  performance$;

  static get() {
    return Zone.current.get('ChangeDetectionTrackingZone');
  }

  private getTasksFor(type: string): { tasks: any[]; tasks$: Subject<TaskChange> } {
    switch (type) {
      case 'microTask':
        return { tasks: this.microTasks, tasks$: this.microTasks$ };
      case 'macroTask':
        return { tasks: this.macroTasks, tasks$: this.macroTasks$ };
      case 'eventTask':
        return { tasks: this.eventTasks, tasks$: this.eventTasks$ };
    }
    throw new Error('Unknown task format: ' + type);
  }

  onScheduleTask(parentZoneDelegate: any, currentZone: any, targetZone: any, task: any): any {
    const tasksInfo = this.getTasksFor(task.type);
    tasksInfo.tasks.push(task);
    tasksInfo.tasks$.next({
      taskType: task.type,
      tasks: tasksInfo.tasks,
      type: 'scheduling',
      task,
    });

    const t = parentZoneDelegate.scheduleTask(targetZone, task);
    if (task.source === 'XMLHttpRequest.send') {
      if (!task.data) task.data = {};
      (task.data as any).start = this.timer();
    }

    return t;
  }

  onCancelTask(parentZoneDelegate: any, currentZone: any, targetZone: any, task: any): any {
    const taskInfo = this.getTasksFor(task.type);
    const tasks = taskInfo.tasks;
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i] == task && task.source !== 'XMLHttpRequest.send') {
        tasks.splice(i, 1);
        break;
      }
    }
    taskInfo.tasks$.next({
      taskType: task.type,
      tasks: taskInfo.tasks,
      type: 'canceling',
      task,
    });

    return parentZoneDelegate.cancelTask(targetZone, task);
  }

  onInvokeTask(parentZoneDelegate: any, currentZone: any, targetZone: any, task: any, applyThis: any, applyArgs: any): any {
    const taskInfo = this.getTasksFor(task.type);
    const tasks = taskInfo.tasks;
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i] == task) {
        tasks.splice(i, 1);
        break;
      }
    }
    taskInfo.tasks$.next({
      taskType: task.type,
      tasks: taskInfo.tasks,
      type: 'invoking',
      task,
    });
    const start = this.timer();
    const r = parentZoneDelegate.invokeTask(targetZone, task, applyThis, applyArgs);
    if (!task.data) task.data = {};
    if (task.source === 'XMLHttpRequest.addEventListener:load') {
      const sendTask = this.macroTasks.find((t) => t.source === 'XMLHttpRequest.send' && (t.data as any).target === (task as any).target);
      (sendTask.data as any).performance = this.timer() - (sendTask.data as any).start;
      for (let i = 0; i < this.macroTasks.length; i++) {
        if (this.macroTasks[i] == sendTask) {
          this.macroTasks.splice(i, 1);
          break;
        }
      }
      taskInfo.tasks$.next({
        taskType: sendTask.type,
        tasks: this.macroTasks,
        type: 'invoked',
        task: sendTask,
      });
    } else {
      (task.data as any).performance = this.timer() - start;
      taskInfo.tasks$.next({
        taskType: task.type,
        tasks: taskInfo.tasks,
        type: 'invoked',
        task,
      });
    }

    return r;
  }

  clearEvents() {
    while (this.eventTasks.length) {
      Zone.current.cancelTask(this.eventTasks[0]);
    }
  }

  startTracking(stable$: Observable<boolean>) {
    //  const eventTasksScheduling$ = this.eventTasks$.pipe(filter((ti: any) => ti.type === 'scheduling'));
    // const microTasksScheduling$ = this.microTasks$.pipe(filter((ti: any) => ti.type === 'scheduling'));
    // const macroTasksScheduling$ = this.macroTasks$.pipe(filter((ti: any) => ti.type === 'scheduling'));

    // const tasksScheduling$ = merge(eventTasksScheduling$, microTasksScheduling$, macroTasksScheduling$);

    // const reset$ = stable$.pipe(map(_ => ({type: 'reset'})));

    // const invokeTasksBetweenStable$ = merge(tasksInvoked$, reset$).pipe(scan((acc: any, t: any) => {
    //   if (t.type === 'reset') {
    //     return [];
    //   }
    //   return acc.concat([t]);
    // }, []), tap((tasks: any) => {
    //   // console.log('tasks between stable', tasks.map(t => t.task.source));
    // }));

    const eventTasksInvoked$ = this.eventTasks$.pipe(filter((ti: any) => ti.type === 'invoked'));
    const microTasksInvoked$ = this.microTasks$.pipe(filter((ti: any) => ti.type === 'invoked'));
    const macroTasksInvoked$ = this.macroTasks$.pipe(filter((ti: any) => ti.type === 'invoked'));
    const tasksInvoked$ = merge(eventTasksInvoked$, microTasksInvoked$, macroTasksInvoked$);

    this.performance$ = tasksInvoked$.pipe(
      map((t: any) => ({
        task: t.task,
        performance: Math.floor(t.task.data.performance * 100) / 100 + 'ms',
      }))
    );
  }
}

// Export the class so that new instances can be created with proper
// constructor params.
(Zone as any)['TaskTrackingZoneSpec'] = ChangeDetectionTrackingZoneSpec;
