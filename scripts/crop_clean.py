import sys
from PIL import Image
import numpy as np
src,dst=sys.argv[1],sys.argv[2]
im=Image.open(src).convert('RGB'); a=np.array(im)
def mag(arr): return (arr[:,:,0]>170)&(arr[:,:,1]<105)&(arr[:,:,2]>170)
m=mag(a)
ys,xs=np.where(~m)
x0,y0=xs.min(),ys.min()
x1,y1=xs.max()+1,ys.max()+1
# trim edges that still contain magenta
while x1>x0 and mag(a[y0:y1, x1-1:x1]).any(): x1-=1
while y1>y0 and mag(a[y1-1:y1, x0:x1]).any(): y1-=1
while x0<x1 and mag(a[y0:y1, x0:x0+1]).any(): x0+=1
while y0<y1 and mag(a[y0:y0+1, x0:x1]).any(): y0+=1
crop=im.crop((x0,y0,x1,y1))
# final safety: verify no magenta
c=np.array(crop); left=int(mag(c).sum())
crop.save(dst, quality=90)
print(dst, crop.size, 'residual magenta:', left)
